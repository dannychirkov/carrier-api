# 1.10 Отримати список опису вантажу


Метод **«getCargoDescriptionList»** працює в моделі **"Common"** цей метод дозволяє завантаження довідника опису вантажу. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getCargoDescriptionList</calledMethod>
    <methodProperties>
    <FindByString>абажур</FindByString> - пошук по рядкам, не обов’язковий параметр
    </methodProperties>
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Common",
    "calledMethod": "getCargoDescriptionList",
    "methodProperties": {
    "FindByString": "абажур" – пошук по рядкам, не обов’язковий параметр
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Опис вантажу  
Ref | int[36] | Ідентифікатор типу платника в АРІ
