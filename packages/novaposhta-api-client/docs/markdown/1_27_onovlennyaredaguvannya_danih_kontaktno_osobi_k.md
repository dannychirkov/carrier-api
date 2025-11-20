# 1.27 Оновлення/редагування даних контактної особи конр агента (Метод «update» )


Метод **«update»** працює в моделі **"ContactPerson"** цей метод необхідний для оновлення/редагування контактної особи контрагента відправника/отримувача. **  
Редагувати дані контактної особи контрагента можуть лише юридичні особи.  
Приватні особи можуть редагувати лише телефон контактної особи контрагента.   
Редагувати дані контрагента можна лише від моменту його створення до моменту створення ІД з ним.**   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>update</calledMethod>
    <methodProperties>
    <CounterpartyRef>5953fb16-08d8-11e4-8958-0025909b4e33</CounterpartyRef>
    <FirstName>Степан</FirstName>
    <LastName>Романенко</LastName>
    <MiddleName>Олександрович</MiddleName>
    <Phone>+380677777788</Phone>
    <Ref>c0597d15-d2cf-11e4-bdb5-005056801329</Ref>
    </methodProperties>
    <modelName>ContactPerson</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "ContactPerson",
    "calledMethod": "update",
    "methodProperties": {
    "CounterpartyRef": "5953fb16-08d8-11e4-8958-0025909b4e33",
    "Ref": "4589c549-ccbb-11e4-bdb5-005056801329",
    "FirstName": "Степан",
    "LastName": "Романенко",
    "MiddleName": "Олександрович",
    "Phone": "+380677777788"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Ref | string[36] | ідентифікатор контактної особи  
Description | string[152] | опис контактної особи  
LastName | string[50] | прізвище контактної особи  
FirstName | string[50] | ім’я контактної особи  
MiddleName | string[50] | по батькові контактної особи  
Phones | int[18] | телефон контактної особи  
Email | string[35] | електронна адреса контактної особи  
  
> Були змінені такі параметри та метод (властивості до оновлення виділені чорним кольором, синім кольором після оновлення):   
> "calledMethod": "save" → "update",   
> "FirstName": "Джон" → "Степан",   
> "MiddleName": "Борисович" → "Олександрович",   
> "LastName": "Кравченко" → "Романенко",   
> "Phone": " 380677775588 " → "306777777788"

* * *

Метод **«delete»** працює в моделі **"ContactPerson"** цей метод необхідний для видалення контактної особи контрагента відправника/отримувача. **  
Видаляти дані контактної особи контрагента можуть лише юридичні особи.**   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>delete</calledMethod>
    <methodProperties>
    <Ref>c0597d15-d2cf-11e4-bdb5-005056801329</Ref>
    </methodProperties>
    <modelName>ContactPerson</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "ContactPerson",
    "calledMethod": "delete",
    "methodProperties": {
    "Ref": "4589c549-ccbb-11e4-bdb5-005056801329"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
Ref | string[36] | ідентифікатор контактної особи конр агента (видаленої)
