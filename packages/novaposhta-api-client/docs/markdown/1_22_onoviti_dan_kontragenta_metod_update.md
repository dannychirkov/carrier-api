# 1.22 Оновити/видалити дані контрагента (метод «update/delet»)


Метод **«update»** працює в моделі **"Counterparty"** цей метод використовується для оновлення (редагування) даних контрагента. **Редагувати дані контрагента можна лише від моменту його створення до моменту створення ІД з ним.**   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>update</calledMethod>
    <methodProperties>
    <CityRef>db5c8911-391c-11dd-90d9-001a92567626</CityRef>
    <CounterpartyProperty>Recipient</CounterpartyProperty>
    <CounterpartyType>PrivatePerson</CounterpartyType>
    <Email />
    <FirstName>Михайло</FirstName>
    <LastName>Колесник</LastName>
    <MiddleName>Іванович</MiddleName>
    <Phone>0991112222</Phone>
    <Ref>89c1fc68-d83d-11e4-bdb5-005056801329</Ref>
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "update",
    "methodProperties": {
    "Ref": "eb7c1c2e-cc85-11e4-bdb5-005056801329",
    "CityRef": "db5c8911-391c-11dd-90d9-001a92567626",
    "FirstName": "Михайло",
    "MiddleName": "Іванович",
    "LastName": "Колесник",
    "Phone": "0991112222",
    "Email": "",
    "CounterpartyType": "PrivatePerson",
    "CounterpartyProperty": "Recipient"
    }
    }
    

> Були змінені такі параметри та метод (властивості до оновлення виділені чорним кольором, синім кольором після оновлення):   
> "calledMethod": "save" → "update",   
> "FirstName": "Роман" → "Михайло",   
> "MiddleName": "Романович" → "Іванович",   
> "LastName": "Романов" → "Колесник",   
> "Phone": "0991112233" → "0991112222"

* * *

Метод **«delet»** працює в моделі **"Counterparty"** цей метод використовується для видалення даних контрагента.   
**Через середовище АРІ 2.0 можливо видаляти лише дані конрагента одержувача. Для видалення даних конрагента відправника звертайтеся до вашого менеджера.**   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getCounterpartyOptions</calledMethod>
    <methodProperties>
    <Ref>5953fb16-08d8-11e4-8958-0025909b4e33</Ref>
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "delete",
    "methodProperties": {
    "Ref": "eb7c1c2e-cc85-11e4-bdb5-005056801329"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
ref | string[36] | ідентифікатор видаленого контрагента
