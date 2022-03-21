import asyncio

from asgiref.sync import sync_to_async
from urllib.parse import urljoin
from django.core.management.base import BaseCommand
from scrapy import Request, Spider
from scrapy.crawler import CrawlerProcess
from apps.sveden.models import ItemPropContainer, Subsection


class SvedenSpider(Spider):
    name = 'sveden'
    url = ''

    def __init__(self, url: str, **kwargs):
        super().__init__(**kwargs)
        self.url = url

    def start_requests(self):
        res = []
        for subsection in Subsection.objects.all():
            res.append(Request(url=urljoin(self.url, subsection.url), callback=self.parse, cb_kwargs={'subsection': subsection}))
        return res

    def parse(self, response, subsection, **kwargs):
        return self.rec(response, subsection)

    async def rec(self, response, subsection):
        yield await self.visit_ref(response, subsection)
        ref_urls = response.xpath('//*[@itemprop="addRef"]/@href').getall()
        for href in ref_urls:
            yield response.follow(href, callback=self.rec, cb_kwargs={'subsection': subsection})
        if subsection.id == 4:
            a = 10

    @sync_to_async()
    def visit_ref(self, response, subsection):
        result: dict[str, list[list[str]]] = {}
        for container in subsection.itempropcontainer_set.all():
            if container.itemprop.item_prop:
                result[str(container.id)] = []
                for pip in response.xpath(f'//*[@itemprop="{container.itemprop.item_prop}"]'):
                    result[str(container.id)].append(
                        [''.join(pip.xpath(f'.//*[@itemprop="{cip.item_prop}"]//text()').getall()) for cip in
                         container.itemprop.childitemprop_set.all()])
            else:
                result[str(container.id)] = [
                    [''.join(response.xpath(f'//*[@itemprop="{x.item_prop}"]//text()').getall()) for x in
                     container.itemprop.childitemprop_set.all()]]
        return result


class SvedenPipeline:
    @sync_to_async()
    def process_item(self, item, spider):
        ipcs = []
        for k, v in item.items():
            ipc = ItemPropContainer.objects.get(pk=k)
            ipc.values += v
            ipcs.append(ipc)
        ItemPropContainer.objects.bulk_update(ipcs, ['values'])
        return item


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('url', type=str)

    def handle(self, *args, **options):
        objs = []
        for obj in ItemPropContainer.objects.all():
            obj.values = []
            objs.append(obj)
        ItemPropContainer.objects.bulk_update(objs, ('values',))
        process = CrawlerProcess(settings={
            "ITEM_PIPELINES": {f'{SvedenPipeline.__module__}.{SvedenPipeline.__name__}': 300}
        })
        process.crawl(SvedenSpider, url=options['url'])
        process.start()
