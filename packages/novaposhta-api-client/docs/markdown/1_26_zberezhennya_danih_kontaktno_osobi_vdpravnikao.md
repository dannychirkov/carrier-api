# 1.26 Збереження даних контактної особи відправника/отримувача (метод «save»)


Метод **«save»** працює в моделі **"ContactPerson"** цей метод необхідний для створення контактної особи контрагента відправника/отримувача. **Всі дані контактної особи конрагента вносяться лише на українській мові.**   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>save</calledMethod>
    <methodProperties>
    <CounterpartyRef>5953fb16-08d8-11e4-8958-0025909b4e33</CounterpartyRef>
    <FirstName>Джон</FirstName>
    <LastName>Кравченко</LastName>
    <MiddleName>Борисович</MiddleName>
    <Phone>+380997979789</Phone>
    </methodProperties>
    <modelName>ContactPerson</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "ContactPerson",
    "calledMethod": "save",
    "methodProperties": {
    "CounterpartyRef": "5953fb16-08d8-11e4-8958-0025909b4e33",
    "FirstName": "Джон",
    "LastName": "Кравченко",
    "MiddleName": "Борисович",
    "Phone": "+380997979789"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Ref | string[36] | ідентифікатор контактної особи  
Description | string[152] | опис контактної особи  
LastName | string[50] | прізвище контактної особи  
FirstName | string[50] | ім’я контактної особи  
MiddleName | string[50] | по батькові контактної особи  
Phones | int[18] | телефон контактної особи  
Email | string[35] | електронна адреса контактної особи
