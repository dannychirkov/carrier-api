# 1.5 Завантажити довідник відділень компанії «Нова пошта» (метод «getWarehouses»)

Метод **«getWarehouses»** працює в моделі **"Address"**, цей метод завантажує довідник відділень НП в рамках населених пунктів України. Необхідно зберігати копію довідників на стороні клієнта та підтримувати її в актуальному стані. Рекомендується проводити оновлення довідників раз на добу.   
Доступність: Не потребує використання API-ключа

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <modelName>Address</modelName>
    <calledMethod>getWarehouses</calledMethod>
    <methodProperties>
    <CityRef>8d5a980d-391c-11dd-90d9-001a92567626</CityRef>
    </methodProperties>
    </file>
    

### JSON
    
    
    {
        "apiKey": "",
        "modelName": "Address",
        "calledMethod": "getCities",
        "methodProperties": {
        "CityRef": "8d5a980d-391c-11dd-90d9-001a92567626"
    }
    }
    

Параметр | Тип | Опис  
---|---|---  
CityRef | string[36] | Ідентифікатор міста(Завантажено за допомогою методу Address/getCities)  
WarehouseId | int | Номер відділення у обраному населеному пункті (Додатковий фільтр, не обов’язковий для використання)  
Page | int | Сторінка з інформацією для відображення (Не більше 500 записів на одній сторінці)  
  
### Опис відповіді на запит

Параметри | Тип | Опис  
---|---|---  
SiteKey | decimal[9999999999] | Код відділення  
Description | string[99] | Назва відділення  
DescriptionRu | string[99] | Назва відділення на рос. мові  
TypeOfWarehouse | string[36] | Тип відділення  
Ref | string[36] | Ідентифікатор відділення  
Number | int[99999] | Номер відділення  
CityRef | string[36] | Ідентифікатор населеного пункту  
CityDescription | string[50] | Назва населеного пункту  
CityDescriptionRu | string[50] | Назва населеного пункту на рос. мові  
TotalMaxWeightAllowed | int[9999999999] | Максимальна вага відправлення  
PlaceMaxWeightAllowed | int[9999999999] | Максимальна вага одного місця відправлення  
Reception | array[7] | Графік роботи  
Delivery | array[7] | Графік видачі відправлення на відділенні  
Schedule | array[7] | Графік прийому відправлень для відправки в той же день  
  
Якщо замінити метод **"getWarehouses"** на метод **"getWarehouseTypes"** , можливо отримати додаткові довідники:

TypeOfWarehouse |   
---|---  
6f8c7162-4b72-4b0a-88e5-906948c6a92f | Parcel Shop  
841339c7-591a-42e2-8233-7a0a00f0ed6f | Поштове відділення  
95dc212d-479c-4ffb-a8ab-8c1b9073d0bc | Поштомат приват банку  
9a68df70-0267-42a8-bb5c-37f427e36ee4 | Вантажне відділення
