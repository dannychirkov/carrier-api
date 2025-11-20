# 1.2 Опис загальних параметрів

### Всі запити мають наступний вигляд:

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <root>
    <apiKey>API key</apiKey>
    <modelName></modelName>
    <calledMethod></calledMethod>
    <methodProperties>
    </methodProperties>
    </root>
    

### JSON
    
    
    {
        "apiKey": "API key",
        "modelName": "",
        "calledMethod": "",
        "methodProperties": {}
    }
    

Параметр | Опис  
---|---  
apiKey | Ключ АРІ  
modelName | Назва групи методів  
calledMethod | Ім’я викликаного методу  
methodProperties | Параметри методу  
  
### Формат відповіді на запит  

### xml
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <root>
    <success></success>
    <data></data>
    <errors/>
    <warnings/>
    <info/>
    </root>
    

### json


    {
        "success": true,
        "data": [],
        "errors": [],
        "warnings": [],
        "info": []
    }
    

Параметр | Опис  
---|---  
success | Статус обробки запиту [true /false]  
data | Блок, що містить дані запиту  
warnings | Блок, що містить додаткову інформацію про статус обробки запиту  
errors | Блок, що містить перелік помилок при оброці запиту  
  
> Різні типи запитів виконуються за різними методами в різних моделях. Види моделей:
> 
>   1. «InternetDocument» - модель для оформлення відправлень
>   2. «Common» - модель для роботи з довідниками
>   3. «Counterparty» - модель для роботи з даними контрагента
>   4. «ContactPerson» - модель для роботи з даними контактної особи
>   5. «Address» - модель для роботи з адресами
>   6. «ScanSheet» - модель для роботи з реєстрами прийому-передачі відправлення
> 

