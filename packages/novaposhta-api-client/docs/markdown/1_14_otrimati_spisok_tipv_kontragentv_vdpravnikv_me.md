# 1.14 Отримати список типів контрагентів відправників (метод «getTypesOfCounterparties»)


Метод **«getTypesOfCounterparties»** працює в моделі **"Common"** цей метод дозволяє завантажити типи контрагентів. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getTypesOfCounterparties"</calledMethod>
    <methodProperties>
    </methodProperties>
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Common",
    "calledMethod": "getTypesOfCounterparties"",
    "methodProperties": {}
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Опис типу контрагента  
Ref | int[36] | ідентифікатор в системі АРІ
