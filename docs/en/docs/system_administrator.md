
# Для системных администраторов

## Минимальные требования к серверу

Системные требования сервера:
* ОС: любой дистрибутив Linux(Ubuntu, Debian и т. д.)
* Двухъядерный процессор с частотой 2 ГГц или лучше
* Оперативной памяти минимум 4 Гб
* 32 Гб свободного пространства на жестком диске

Кроме этого на сервере должны быть установлены следующие зависимости:

| Зависимость                                                                   |  Версия  |
|-------------------------------------------------------------------------------|:--------:|
| [PostgreSQL](https://www.postgresql.org/download/)                            |  latest  |
| [docker](https://docs.docker.com/engine/install/ubuntu)                       |  latest  |
| [docker-compose](https://docs.docker.com/compose/install/compose-desktop)     |  latest  |
| [Nginx](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/) |  latest  |

## Развертка и настройка электронной образовательной среды

После установки всех зависомостей необходимо:
1. [Аутентифицироваться в реестре контейнеров](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry):
    ```shell
    docker login ghcr.io -u USERNAME -p TOKEN
    ```
2. Создать директорию для хранения файлов и конфигурационные файлы для развертывания элетронной образовательной среды:
   1. Создание директории:
        ```shell
        sudo mkdir /var/www/eleden/storage 
        ```
   2. Создать файл `.env` со следующим содержимом:
        ```env_file
        # Client settings
        # Data connection
        APP_NAME='Электронная образовательная среда'
        URL=https://example.ru
        API_URL=http://192.168.1.3:8000/graphql/
        API_URL_BROWSER=https://example.ru/graphql/
        WS_URL=wss://example.ru/graphql/
        CLIENT_ID=
        CLIENT_SECRET=
        # Settings for sentry
        SENTRY_CLIENT_DSN=
        TINYMCE_API=
        ASK=
        # Server settings
        SECRET_KEY=
        DEBUG=False
        # Application database data
        DB_APP_HOST=
        DB_APP_NAME=
        DB_APP_USER=
        DB_APP_PASSWORD=
        # Email settings
        EMAIL_HOST=
        EMAIL_HOST_USER=
        EMAIL_HOST_PASSWORD=
        EMAIL_HOST_SUPPORT=
        # Sentry integration
        SENTRY_DNS=
        # Notification service interation
        FCM_API_KEY=
        # Settings for celery
        REDIS_SERVER=redis
        # Data for celery
        BROKER_URL=redis://redis:6379
        BROKER_BACKEND=redis://redis:6379
        TASK_SERIALIZER=json
        RESULT_SERIALIZER=json
        ```
   3. Создать файл `docker-compose.yml` со следующим содержимом:
        ```yml
        version: '3.7'
        
        services:
          client:
            container_name: client
            image: ghcr.io/devind-team/eleden/eleden-client:latest
            command: yarn run nuxt start
            restart: always
            ports:
              - "3000:3000"
            env_file: .env
        
          api:
            container_name: api
            image: ghcr.io/devind-team/eleden/eleden-server:latest
            command: poetry run daphne -b 0.0.0.0 -p 8000 devind.asgi:application
            restart: always
            ports:
              - "8000:8000"
            env_file: .env
            volumes:
              - "/var/www/eleden/storage:/usr/src/app/storage"
        
          celery:
            container_name: celery
            image: ghcr.io/devind-team/eleden/eleden-server:latest
            command: poetry run celery -A devind worker -B -E -l INFO
            restart: always
            env_file: .env
            volumes:
              - "/var/www/eleden/storage:/usr/src/app/storage"
        
          redis:
            image: redis
            restart: always
        ```
3.  Создать и запустить докер контейнеры:
    > Команды `docker-compose` выполняюся в директории, где находится файл `docker-compose.yml`
    ```shell
    # Извлечение образа
    sudo docker-compose pull
    # Создание и запуск контейнеров
    sudo docker-compose up -d
    ```
4. Создать и настроить базу данных:
   1. Создание пользователя, базы данных и присвоение всех привилегий пользователю над базой данных:
    ```shell
    # Подключение к PostgreSQL
    sudo psql -U postgres
    ```
    ```PostgreSQL
    create user username with encrypted password 'user_password';
    create database database_name;
    grant all privileges on database database_name to username;
    grant connect on database database_name TO username;
    ```
    1. Изменить конфигурационный файл PostgreSQL(`/etc/postgresql/latest_version/main/`), добавив в него записи:
    ```
    host    database_name         username        ip_addres_docker_container/24           md5
    ```
    1. Перезапустить PostgreSQL
    ```shell
    sudo service postgresql restart
    ```
5. Наполнение базы данных начальными данными:
    ```shell
    # Создание таблиц в базе данных
    sudo docker-compose run api poetry run python manage.py migrate
    # Наполнение базы данных начальными данными
    sudo docker-compose run api poetry run python manage.py fs
    ```
6. Настройка `nginx`
   1. Создать файл в `/etc/nginx/sites-available` со следующим содержимом:
    ```nginx
    upstream channels-site {
        server localhost:8000;
    }
    
    server {
        listen 443 ssl http2;
        server_name site.ru www.site.ru;
    
        access_log /var/log/nginx/site.ru.access.log;
        error_log /var/log/nginx/site.ru.error.log;
    
        client_max_body_size 32m;
    
        #ssl on;
        ssl_certificate /etc/ssl/certificate/site.crt;
        ssl_certificate_key /etc/ssl/certificate/site.key;
    
        location /storage/ {
            alias /var/www/site/storage/;
        }
    
        location /graphql/ {
            proxy_pass http://channels-site;
    
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
    
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Host $server_name;
        }
    
        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    
    server {
        listen 80;
        server_name site.ru www.site.ru;
        return 301 https://$host$request_uri;
    }
    ```
   2. Создать символическую ссылку созданного файла в `/etc/nginx/sites-enabled`:
    ```shell
    ln -s /etc/nginx/sites-available/file_name.conf /etc/nginx/sites-enabled
    ```
   3. Перезапустить `nginx`
    ```
    sudo service nginx restart
    ```

