# 1.15 Отримати список видів платників зворотної доставки (метод «getTypesOfPayersForRedelivery»)


Метод **«getTypesOfPayersForRedelivery»** працює в моделі **"Common"** цей метод дозволяє завантажити список видів платників послуги зворотної доставки: Відправник, Отримувач. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getTypesOfPayersForRedelivery"</calledMethod>
    <methodProperties>
    </methodProperties>
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Common",
    "calledMethod": "getTypesOfPayersForRedelivery",
    "methodProperties": {}
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Тип платника (Відправник/Одержувач)  
Ref | int[36] | ідентифікатор в системі АРІ (Sender/Recipient)
