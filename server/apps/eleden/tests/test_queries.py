edu_form_query = '''
    query {
         eduForms {
            id
            name
            shortName
         }
    }
'''

add_edu_form_mutation = '''
     mutation addEduForm($input: AddEduFormMutationInput!) {
        addEduForm(input: $input) {
            eduForm {
                id
                name
                shortName
            }
        }
    }
'''

change_edu_form_mutation = '''
     mutation changeEduForm($input: ChangeEduFormMutationInput!) {
        changeEduForm(input: $input) {
            eduForm {
                id
                name
                shortName
            }
        }
    }
'''

delete_edu_form_mutation = '''
    mutation deleteEduForm($input: DeleteEduFormMutationInput!) {
        deleteEduForm(input: $input) {
            success
        }
    }
'''

edu_program_list_query = '''
    query eduProgram {
        eduPrograms {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
'''

add_edu_program_mutation = '''
    mutation addEduProgram($input: AddEduProgramMutationInput!) {
        addEduProgram(input: $input) {
            eduProgram {
                id
                name
                adaptive
                admission
                expedited
                eduForm {
                    id
                }
                direction {
                    id
                }
            }
        }
    }
'''


get_token = '''
    mutation getToken($input: GetTokenMutationInput!){
        getToken (input: $input){
            success
            errors {
                field
                messages
            }
            accessToken
            refreshToken
        }
    }
'''


register_new_user = '''
    mutation register($input: RegisterMutationInput!){
        register(input: $input){
            success
            errors {
                field
                messages
            }
        }
    }
'''


query_me = '''
    query {
        me {
            username
        }
    }
'''