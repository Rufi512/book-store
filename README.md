# Book store
This is a test from scraping of books in the page (https://www.goodreads.com/)

## How to use
Get the first page of books, with 20 results per page
```HTTP
GET https://book-store-mh5a.onrender.com/api/books/list?q=<name_book>&p=1
```

Get a specific book (is necessary the id from book)
```HTTP
GET https://book-store-mh5a.onrender.com/api/books/show/38201488-miedo
```

## How to run

1. Install dependecies
```
pnpm i
```

2. Run
```
pnpm run dev
```