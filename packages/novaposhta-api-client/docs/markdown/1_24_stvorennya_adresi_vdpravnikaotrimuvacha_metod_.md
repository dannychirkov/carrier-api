# 1.24 Створення адреси відправника/отримувача (метод «save»)

Метод **«save»** працює в моделі **"Address"**, цей метод зберігає адреси контрагента відправника/отримувача.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>save</calledMethod>
    <methodProperties>
    <BuildingNumber>12</BuildingNumber>
    <CounterpartyRef>56300fb9-cbd3-11e4-bdb5-005056801329</CounterpartyRef>
    <Flat>10</Flat>
    <Note>Коментар</Note>
    <StreetRef>d8364179-4149-11dd-9198-001d60451983</StreetRef>
    </methodProperties>
    <modelName>Address</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Address",
    "calledMethod": "save",
    "methodProperties": {
    "CounterpartyRef": "5953fb16-08d8-11e4-8958-0025909b4e33",
    "StreetRef": "d8364179-4149-11dd-9198-001d60451983",
    "BuildingNumber": "12",
    "Flat": "10",
    "Note": "Коментар"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
CounterpartyRef | string[36] | Ідентифікатор контрагента  
StreetRef | string[36] | Ідентифікатор вулиці з посібника  
BuildingNumber | int[36] | Номер будинку  
Flat | int[36] | Номер квартири  
Note | string[36] | Коментар  
  
### Опис відповіді:

Параметр | Тип | Опис
---|---|---
Ref | string[36] | Ідентифікатор створеної адреси
Description | string[36] | Опис створеної адреси
