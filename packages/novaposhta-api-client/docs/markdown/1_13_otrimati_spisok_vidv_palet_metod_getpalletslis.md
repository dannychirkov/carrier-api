# 1.13 Отримати список видів палет (метод «getPalletsList»)


Метод **«getPalletsList»** працює в моделі **"Common"** цей метод дозволяє завантаження списку палет (використовується, якщо замовлена послуга зворотної доставки піддонів). Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на місяць.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getPalletsList</calledMethod>
    <methodProperties>
    </methodProperties>
    <modelName>Common</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Common",
    "calledMethod": "getPalletsList",
    "methodProperties": {}
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Опис параметрів піддону  
Ref | int[36] | ідентифікатор в системі АРІ  
DescriptionRu | string[50] | «описание параметров паллеты»  
Weight | string[] | вага
