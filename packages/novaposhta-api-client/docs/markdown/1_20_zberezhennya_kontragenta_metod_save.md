# 1.20 Збереження контрагента (Метод «save»)

Метод **«save»** працює в моделі **"Counterparty"**, цей метод використовується при збереженні контрагента отримувача. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>8bd43f22d71d65113ca9fce0a88af252</apiKey>
    <calledMethod>save</calledMethod>
    <methodProperties>
    <CityRef>db5c88d7-391c-11dd-90d9-001a92567626</CityRef>
    <CounterpartyProperty>Recipient</CounterpartyProperty>
    <CounterpartyType>PrivatePerson</CounterpartyType>
    <Email />
    <FirstName>Фелікс</FirstName>
    <LastName>Яковлєв</LastName>
    <MiddleName>Едуардович</MiddleName>
    <Phone>0997979789</Phone>
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "save",
    "methodProperties": {
    "CityRef": "db5c88d7-391c-11dd-90d9-001a92567626",
    "FirstName": "Фелікс",
    "MiddleName": "Едуардович",
    "LastName": "Яковлєв",
    "Phone": "0997979789",
    "Email": "",
    "CounterpartyType": "PrivatePerson",
    "CounterpartyProperty": "Recipient"
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
  
> Дані параметри обов'язкові для заповнення.

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
