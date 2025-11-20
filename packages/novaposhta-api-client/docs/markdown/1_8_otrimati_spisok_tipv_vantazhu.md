# 1.8 Отримати список типів вантажу


Метод **«getCargoTypes»** працює в моделі **"Common"** цей метод дозволяє отримати список типів вантажу. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getCargoTypes</calledMethod>
    <methodProperties />
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
      "modelName": "Common",
      "calledMethod": "getCargoTypes",
      "apiKey": "ваш ключ АРІ 2.0",
      "methodProperties": {}
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Тип платника (Вантаж/Документи/Шини-диски/Палети)  
Ref | int[36] | Ідентифікатор типу платника в АРІ (Cargo/Documents/TiresWheels/Pallet)
