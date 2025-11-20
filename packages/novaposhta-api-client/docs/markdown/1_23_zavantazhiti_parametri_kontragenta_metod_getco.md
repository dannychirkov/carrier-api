# 1.23 Завантажити параметри контрагента (метод «getCounterpartyOptions»)


Метод **«getCounterpartyOptions»** працює в моделі **"Counterparty"** цей метод використовується для отримання параметрів контрагента відправника/отримувача.   
Доступність: Потребує використання API-ключа.

### XML
    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <file>
    <apiKey>Ваш ключ АРІ 2.0</apiKey>
    <calledMethod>getCounterpartyOptions</calledMethod>
    <methodProperties>
    <Ref>5953fb16-08d8-11e4-8958-0025909b4e33</Ref>
    </methodProperties>
    <modelName>Counterparty</modelName>
    </file>
    

### JSON
    
    
    {
    "apiKey": "Ваш ключ АРІ 2.0",
    "modelName": "Counterparty",
    "calledMethod": "getCounterpartyOptions",
    "methodProperties": {
    "Ref": "5953fb16-08d8-11e4-8958-0025909b4e33"
    }
    }
    

### Опис відповіді на запити

Параметри | Тип | Опис  
---|---|---  
CanPayTheThirdPerson | string[36] | платником третя особа: так/ні  
CanAfterpaymentOnGoodsCost | string[36] | оплата коштів за товар: так: так/ні  
CanAfterpaymentOnGoodsCost | string[36] | безготівковий розрахунок: так/ні  
CanNonCashPayment | string[36] | оформлення кредиту: так/ні  
CanCreditDocuments | string[36] | прихована сума за доставку: так/ні  
HideDeliveryCost | string[36] | доставка день в день: так/ні  
CanSameDayDelivery | string[36] | експедирування: так/ні  
DeliveryByHand | string[36] | доставка в руки: так/ні  
DescentFromFloor | string[36] | спуск з поверха: так/ні  
BackDeliveryValuablePapers | string[36] | зворотна доставка Ц1П так/ні  
BackwardDeliverySubtypesDocuments | string[36] | зворотна доставка документів: так/ні  
AfterpaymentType | string[36] | контроль оплати так/ні  
HaveMoneyWallets | string[36] | -
