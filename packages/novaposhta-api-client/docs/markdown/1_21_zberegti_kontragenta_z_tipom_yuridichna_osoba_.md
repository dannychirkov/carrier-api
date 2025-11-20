# 1.21 Зберегти контрагента з типом (юридична особа/третя особа)


Метод **«save»** працює в моделі **"Counterparty"** цей метод використовується для збереження контрагента юр.особу/організацію. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8" ?>
    <file>
    <apiKey>3468df227dda62ea2f93dc0e84c7bcef</apiKey>
    <modelName>Counterparty</modelName>
    <calledMethod>save</calledMethod>
    <methodProperties>
    <CityRef>8d5a980d-391c-11dd-90d9-001a92567626</CityRef>
    <FirstName>ТурбоФірма</FirstName>
    <MiddleName></MiddleName>
    <LastName></LastName>
    <Phone></Phone>
    <Email></Email>
    <CounterpartyType>Organization</CounterpartyType>
    <CounterpartyProperty>Recipient</CounterpartyProperty>
    <OwnershipForm>7f0f351d-2519-11df-be9a-000c291af1b3</OwnershipForm>
    </methodProperties>
    </file>
    

### JSON
    
    
    {
    "apiKey": "3468df227dda62ea2f93dc0e84c7bcef",
    "modelName": "Counterparty",
    "calledMethod": "save",
    "methodProperties": {
    "CityRef": "8d5a980d-391c-11dd-90d9-001a92567626",
    "FirstName": "ФірмаТурбо",
    "MiddleName": "",
    "LastName": "",
    "Phone": "",
    "Email": "",
    "CounterpartyType": "Organization",
    "CounterpartyProperty": "Recipient",
    "OwnershipForm": "7f0f351d-2519-11df-be9a-000c291af1b3"
    }
    }
    

* * *

Метод **«save»** працює в моделі **"Counterparty"** цей метод використовується для збереження контрагента третя особа. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>save</calledMethod>
    <methodProperties>
    <CityRef>8d5a980d-391c-11dd-90d9-001a92567626</CityRef>
    <CounterpartyProperty>ThirdPerson</CounterpartyProperty>
    <CounterpartyType>Organization</CounterpartyType>
    <EDRPOU>99999999</EDRPOU>
    <Email />
    <FirstName />
    <LastName />
    <MiddleName />
    <OwnershipForm />
    <Phone />
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": " Ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "save",
    "methodProperties": {
    "CityRef": "8d5a980d-391c-11dd-90d9-001a92567626",
    "FirstName": "",
    "MiddleName": "",
    "LastName": "",
    "Phone": "",
    "Email": "",
    "CounterpartyType": "Organization",
    "CounterpartyProperty": "ThirdPerson",
    "EDRPOU": "99999999",
    "OwnershipForm": ""
    }
    }
    

Параметр | Тип | Опис  
---|---|---  
CityRef | string[36] | Ідентифікатор міста контрагента  
CounterpartyProperty | string | Вид контрагента (відправник, одержувач)  
CounterpartyType | string | Тип контрагента (приватна особа, організація)  
FirstName | string[25] | Ім’я  
LastName | string[50] | Прізвище  
MiddleName | string[25] | По батькові  
Phone | string[18] | Контактний телефон  
OwnershipForm | string[36] | Тип форми власності підприємства. Для типу контрагента Organization необхідно вказувати форму власності організації  
  
### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
ref | string[36] | Ідентифікатор контрагента  
Description | string[60] | Найменування контрагента  
FirstName | string[25] | Ім’я  
MiddleName | string[25] | По батькові  
LastName | string[25] | Прізвище  
OwnershipForm | string[36] | Ідентифікатор форми власності  
OwnershipFormDescription | string[50] | Найменування форми власності  
CounterpartyType | string[36] | Тип контрагента  
Блок ContactPerson | array  
Description | string[60] | Найменування контактної особи  
Ref | string[36] | Ідентифікатор контактної особи  
LastName | повтор | Прізвище  
FirstName | повтор | Ім’я  
MiddleName | повтор | По батькові
