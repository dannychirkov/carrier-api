# 1.25 Оновлення/видалення адреси контрагента відправника/отримувача (метод «update/delete»)


Метод **«update»** працює в моделі **"Address"** цей метод необхідний для оновлення адреси контрагента відправника/отримувача. **Редагувати дані контрагента можна лише від моменту його створення до моменту створення ІД з ним.**   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>update</calledMethod>
    <methodProperties>
    <BuildingNumber>45</BuildingNumber>
    <CounterpartyRef>5953fb16-08d8-11e4-8958-0025909b4e33</CounterpartyRef>
    <Flat>12</Flat>
    <Note>Коментар</Note>
    <Ref>503702df-cd4c-11e4-bdb5-005056801329</Ref>
    <StreetRef>4c4a7cdf-561d-11de-9bd4-0021918b679a</StreetRef>
    </methodProperties>
    <modelName>Address</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Address",
    "calledMethod": "update",
    "methodProperties": {
    "CounterpartyRef": "5953fb16-08d8-11e4-8958-0025909b4e33",
    "Ref": "503702df-cd4c-11e4-bdb5-005056801329",
    "StreetRef": "4c4a7cdf-561d-11de-9bd4-0021918b679a",
    "BuildingNumber": "45",
    "Flat": "12",
    "Note": "Коментар"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Ref | string[36] | Ідентифікатор адреси  
Description | string[36] | Опис оновленої адреси  
  
> Були змінені такі параметри та метод (властивості до оновлення виділені чорним кольором, синім кольором після оновлення):   
> "StreetRef": "d8364179-4149-11dd-9198-001d60451983" → "4c4a7cdf-561d-11de-9bd4-0021918b679a"   
> "BuildingNumber": "10" → "45",   
> "Flat": "10" → "12",

* * *

Метод **«delete»** працює в моделі **"Address"** цей метод необхідний для видалення адреси контрагента відправника/отримувача. **Редагувати дані контрагента можна лише від моменту його створення до моменту створення ІД з ним.**   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>delete</calledMethod>
    <methodProperties>
    <Ref>503702df-cd4c-11e4-bdb5-005056801329</Ref>
    </methodProperties>
    <modelName>Address</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Address",
    "calledMethod": "delete",
    "methodProperties": {
    "Ref": "503702df-cd4c-11e4-bdb5-005056801329"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Ref | string[36] | ідентифікатор адреси (видаленої)
