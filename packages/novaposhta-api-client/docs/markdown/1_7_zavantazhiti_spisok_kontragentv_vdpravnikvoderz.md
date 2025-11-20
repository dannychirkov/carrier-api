# 1.6 Завантажити список контрагентів відправників/одержувачів/адрес контрагентів/контактних осіб (getCounterparties/getCounterpartyAddresses/getCounterpartyContactPerson)

Метод **«getCounterparties»** працює в моделі **"Counterparty"**, цей метод завантажує список контрагентів відправників/одержувачів НП. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на добу.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getCounterparties</calledMethod>
    <methodProperties>
    <CounterpartyProperty>Sender</CounterpartyProperty> або "Recipient"
    <Page>1</Page>
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "getCounterparties",
    "methodProperties": {
    "CounterpartyProperty": "Sender", або "Recipient" якщо одержувач
    "Page": "1"
    }
    }
    

Параметр | Тип | Опис  
---|---|---  
CounterpartyProperty | string[36] | Вид контрагента  
Sender/Recipient | string[36] | Відправник або одержувач  
Page | int | Сторінка з інформацією для відображення (Не більше 500 записів на одній сторінці)  
  
> Якщо в цей запит додати параметр «FindByString» (пошук по рядкам) і в його властивостях прописати назву контрагента (Талісман) який потрібно знайти,
>     
>     
>     {
>     "apiKey": "ваш ключ АРІ 2.0",
>     "modelName": "Counterparty",
>     "calledMethod": "getCounterparties",
>     "methodProperties": {
>     "CounterpartyProperty": "Sender",
>     "Page": "1",
>     "FindByString":"Талісман"
>     }
>     }
>     
> 
> то отримаємо запит за допомогою якого в довіднику знаходиться потрібний контрагент.

* * *

Метод **«getCounterpartyAddresses»** працює в моделі **"Counterparty"**, цей метод завантажує список адрес контрагентів відправників/одержувачів НП. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на добу.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getCounterpartyAddresses</calledMethod>
    <methodProperties>
    <CounterpartyProperty>Sender</CounterpartyProperty> або "Recipient" якщо одержувач
    <Ref>6e9acced-d072-11e3-95eb-0050568046cd</Ref>
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "getCounterpartyAddresses",
    "methodProperties": {
    "Ref": "5953fb16-08d8-11e4-8958-0025909b4e33",
    "CounterpartyProperty": "Sender" або "Recipient" якщо отримувач
    }
    }
    

Параметр | Тип | Опис  
---|---|---  
CounterpartyProperty | string[36] | Вид контрагента  
Ref | string[36] | Ідентифікатор контрагента  
Sender/Recipient | string[36] | Відправник або одержувач  
  
* * *

Метод **«getCounterpartyContactPersons»** працює в моделі **"Counterparty"**, цей метод завантажує контактних осіб контрагентів НП. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на добу.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getCounterpartyContactPersons</calledMethod>
    <methodProperties>
    <Ref>6e9acced-d072-11e3-95eb-0050568046cd</Ref>
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "getCounterpartyContactPersons",
    "methodProperties": {
    "Ref": "5953fb16-08d8-11e4-8958-0025909b4e33"
    }
    }
    

Параметр | Тип | Опис  
---|---|---  
Ref | string[36] | Ідентифікатор контрагента  
  
### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
LastName | string[50] | Прізвище  
FirstName | string[25] | Ім’я  
MiddleName | string[25] | По батькові  
Phone | string[18] | Контактний телефон  
Email | int[36] | Електронна адреса поштової скриньки  
Description | string[50] | опис (контактна особа)  
Ref | int[36] | ідентифікатор контактної особи
