# DeviceDesk
Электронный журнал для тестовых девайсов (телефонов и планшетов)

В организации где есть тестовые девайсы в совместном доступе этот журнал пригодиться для записи когда сотрудник берет устройство и возвращает.
Когда другому сотруднику понадобится отсутствующий девайс, он сможет легко выяснить кем занято устройство.

Аренда и возврат устройств производится сканированием вебкамерой QR-кода наклеенного на девайс.
QR код генерируется админкой при добавлении устройства.

## Prerequirements
* Node.js v4.4.6
* NPM v2.15.5
* MongoDB v3.2.7

## Установка и запуск
```
npm i
node createDB.js
npm start
```


Проект выполнен для дипломной работы бакалавра.