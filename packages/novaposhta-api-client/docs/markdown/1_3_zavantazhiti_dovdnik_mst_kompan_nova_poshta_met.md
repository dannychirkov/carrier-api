# 1.3 Завантажити довідник міст компанії «Нова Пошта» (метод «getCities»)

Метод **«getCities»** працює в моделі **"Address"** , цей метод завантажує довідник населених пунктів України. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на добу. Доступність: Не потребує використання API-ключа

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <modelName>Address</modelName>
    <calledMethod>getCities</calledMethod>
    <methodProperties>
    . . . 
    </methodProperties>
    </file>
    

### JSON
    
    
    {
        "apiKey": "",
        "modelName": "Address",
        "calledMethod": "getCities",
        "methodProperties": {…}
    }
    

### Опис відповіді на запит

Параметри | Тип | Опис  
---|---|---  
Description | string[50] | Назва населеного пункта  
DescriptionRu | string[50] | Назва населеного пункта на рос. мові  
Ref | string[36] | Ідентифікатор населеного пункта  
Delivery1- Delivery7 | int[1] | Наявність доставки відправлення у днях тижня  
Area | string[36] | Область  
CityID | int[] | Код населеного пункту  
  
> Якщо в цей запит додати параметр «FindByString» (пошук по рядкам) і в його властивостях прописати назву населеного пункта (Бровари) який потрібно знайти, Приклад запиту
>     
>     
>     {
>     "apiKey": " ваш ключ АРІ 2.0",
>     "modelName": "Address",
>     "calledMethod": "getCities",
>     "methodProperties": 
>     {
>     "FindByString": "Бровари"  
>     }
>     
> 
> То отримаємо запит за допомогою якого в довіднику знаходиться населений пункт.
