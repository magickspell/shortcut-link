![Profilance Group](https://static.tildacdn.com/tild3638-3338-4136-b038-313132306438/Group_640.svg "Profilance Group")

# Тестовое задание для frontend-разработчика Profilance Group

Необходимо разработать клиент для сервиса сокращения ссылок.

Прототип внешнего вида доступен по [ссылке](https://disk.yandex.ru/i/LvQf6WK8zfayjQ) 

1) Должна быть реализована форма создания сокращенной ссылки. Запрос `shorten_url`.
2) Все ошибки должны обрабатываться, должна быть реализована валидация на клиенте.
3) Раздел "Мои ссылки" должен формироваться из ссылок созданных в течение пользовательского сеанса на основе ответов сервера (он сбрасывается после обновления страницы)
4) Для формирования раздела "Список ссылок" используется запрос `short_urls`. Должна быть реализована пагинация этого списка.
5) Количество переходов по ссылке должно обновляться в реальном времени

## Требования к клиентской части

1) Адаптивная вестка с использованием БЭМ и SASS/SCSS
2) React + Redux + Websoket

## Сервер

### GraphQL API

Endpoint: http://test-task.profilancegroup-tech.com/graphql

Схема:

```graphql
"Список коротких ссылок."
short_urls(
    url: String @rules(apply: ["string", "max: 2048", "url"]) @eq
    hash: String @rules(apply: ["string", "size: 8"]) @eq
): [ShortUrl] @paginate(defaultCount: 20)

"Сокращение ссылки."
shorten_url(
    url: String @rules(apply: ["string", "max: 2048", "url"])
): short_url_result

"Короткая ссылка."
type ShortUrl {
    id: ID
    url: String
    short_url: String
    clicks: Int
    created_at: DateTime
    updated_at: DateTime
}

"Результат выполнения операции над короткой ссылкой."
type short_url_result {
    short_url: ShortUrl
    operation_status: operation_status
}

"Информация о пагинации. Содержится в поле paginatorInfo рядом с data, например в short_urls."
type PaginatorInfo {
  "Number of items in the current page."
  count: Int!
  "Index of the current page."
  currentPage: Int!
  "Index of the first item in the current page."
  firstItem: Int
  "Are there more pages after this one?"
  hasMorePages: Boolean!
  "Index of the last item in the current page."
  lastItem: Int
  "Index of the last available page."
  lastPage: Int!
  "Number of items per page."
  perPage: Int!
  "Number of total available items."
  total: Int!
}


```
### Websockets

Endpoint: http://test-task.profilancegroup-tech.com:6002

Канал: `btti_database_short_urls`

Событие: `new_click`

Данные события содержат полную модель короткой ссылки - https://i.imgur.com/2rwGyJ8.png.

Реализация подписки на события на клиенте https://laravel.com/docs/9.x/broadcasting#client-side-installation

Конфигурация Echo

```javascript
{
    const echo = new Echo({
      broadcaster: 'socket.io',
      host: 'http://test-task.profilancegroup-tech.com:6001'
    });
}
```
