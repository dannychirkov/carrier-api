# 1.16 Отримати список часових інтервалів (метод «getTimeIntervals»)


Метод **«getTimeIntervals»** працює в моделі **"Common"** цей метод дозволяє завантажити список часових інтервалів (для замовлення послуги «часові інтервали»). Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getTimeIntervals</calledMethod>
    <methodProperties>
    <DateTime>31.03.2015</DateTime>
    <RecipientCityRef>8d5a980d-391c-11dd-90d9-001a92567626</RecipientCityRef>
    </methodProperties>
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Common",
    "calledMethod": "getTimeIntervals",
    "methodProperties": {
    "RecipientCityRef": "8d5a980d-391c-11dd-90d9-001a92567626",
    "DateTime": "16.03.2015"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Number | string[50] | Ідентифікатор часового інтервалу  
Start | int[36] | Початок  
End | int[36] | Кінець
