# 1.9 Отримати список технологій доставки


Метод **«getServiceType»** працює в моделі **"Common"** цей метод дозволяє отримати список можливих технологій доставки : «склад-склад», «двері-двері», «склад-двері», «двері-склад». Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getServiceType</calledMethod>
    <methodProperties />
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
      "modelName": "Common",
      "calledMethod": "getServiceType",
      "apiKey": "ваш ключ АРІ 2.0",
      "methodProperties": {}
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Тип платника (Двері-Двері/Двері-Склад/Склад-Склад/Склад-Двері)  
Ref | int[36] | Ідентифікатор типу платника в АРІ (DoorsDoors/DoorsWarehouse/WarehouseWarehouse/WarehouseDoors)
