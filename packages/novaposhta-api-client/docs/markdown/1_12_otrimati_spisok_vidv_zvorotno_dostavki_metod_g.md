# 1.12 Отримати список видів зворотної доставки (метод «getBackwardDeliveryCargoTypes»)


Метод **«getBackwardDeliveryCargoTypes»** працює в моделі **"Common"** цей метод дозволяє завантаження список видів зворотної доставки (з послуги «зворотна доставка») вантажу. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getBackwardDeliveryCargoTypes</calledMethod>
    <methodProperties>
    </methodProperties>
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Common",
    "calledMethod": "getBackwardDeliveryCargoTypes",
    "methodProperties": {}
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Опис вантажу зворотної доставки  
Ref | int[36] | ідентифікатор в системі АРІ
