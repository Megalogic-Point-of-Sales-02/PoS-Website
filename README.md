Technical Document Point of Sales 02

Arsitektur Aplikasi
Architectural Patterns
Semacam MVC (Model-View-Controller), tetapi Model-nya tidak berada di dalam NextJS, melainkan langsung dalam bentuk Database. Kemudian, View dan Controllernya menjadi satu dalam satu komponen, dimana View adalah bagian UI-nya (html-nya) dan Controllernya adalah logic sebelum bagian UI.
Architectural Style
Semi-monolithic dan semi-microservices. Aplikasi utama menggunakan NextJS berisi backend dan frontend untuk CRUD Database. Aplikasi Machine Learning Model menggunakan FastAPI sebagai REST API.
Architectural Principal
Menerapkan low coupling (tidak dependent terhadap module lain) dan membuatnya lebih modular (terpecah-pecah) dengan menggunakan Modularization, dengan cara memisahkan dan memecah component-component menjadi lebih kecil sesuai dengan fungsinya masing-masing. Selain itu, juga menggunakan Single Responsibility Principle (SRP), yaitu setiap modules dan component hanya memiliki satu tujuan saja.
Paradigma Programming
Functional Programming atau Functional Component. NextJS menggunakan Component-based dan Component tersebut menggunakan Pure Function, sehingga lebih cepat di-render, lebih simpel, fokus terhadap satu fungsi, dan mudah untuk di-reuse dibandingkan menggunakan Object Oriented Programming atau Class Component yang mana akan melawan kaidah ReactJS itu sendiri.

Struktur Modul/Kode
Main App
Src/App untuk dikhususkan untuk routing dengan metode Server Side Render.
Src/Modules untuk mengimplementasikan Modularization terhadap setiap fitur, sehingga lebih modular.
Src/Components untuk menempatkan Component yang reusable.
Src/Utils untuk menempatkan tools yang bisa digunakan di seluruh aplikasi.
Src/Interface untuk menempatkan interface DTO yang digunakan ketika mentransfer objek (melakukan Fetch API).
Machine Learning Model App
app.py sebagai aplikasi RestAPI menggunakan Fast API
helper.py untuk menjalankan model machine learning dan menjalin koneksi dengan server database.

Persyaratan Sistem
Main App
Next.js version 21
MySQL instance database
Machine Learning Model App
Python version 3.10
FastAPI version 0.111.0

Petunjuk Development
Main App
Clone dari github repository Website Point of Sales 02
Sebelum memulai, buat file.env.local pada root directory seperti gambar di bawah ini. Pastikan anda telah membuat database MySQL, dan akun Google untuk menggunakan Gmail OAuth sudah terdefinisi dengan baik

Jalankan perintah npm install untuk menginstall dependencies pada package.json.
Anda dapat menjalankan aplikasi dengan menjalankan perintah npm run dev.

Machine Learning Model App
Clone dari github repository ML Point of Sales 02
Sebelum memulai, buat file .env pada root directory seperti gambar di bawah ini.

Jalankan perintah pip install -r requirements.txt untuk menginstall dependencies.
Jalankan perintah fastapi run app.py --reload untuk menjalankan aplikasi. 


API Docs
Order
Get Order
URL: /orders
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 
[
{
“id”: 1
"order_date": "2024-01-01",
"ship_date": "2024-01-01",
"customer_id": 1,
"product_id": 1,
"quantity": 1,
"sales": 100000
},
....
]
Add Order
URL: /order
Method: POST
Headers: “Authorization”: “Bearer <Token>”
Request Body: 
{
"order_date": "2024-01-01",
"ship_date": "2024-01-01",
"customer_id": 1,
"product_id": 1,
"quantity": 1,
"sales": 100000
}
Response:
{
 	"message": "Order with ID 1 added successfully"
}


Delete Order
URL: /order
Method: DELETE
Headers: “Authorization”: “Bearer <Token>”
Request Body: 
{
"id”: 1
}
Response:
{
 	"message": "Order with ID 1 deleted successfully"
}
Total Orders
URL: /orders/total
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 18
Monthly Orders
URL: /orders/monthly
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Request Params: date_prefix=“2024-05”
Response: "897750000"



Product
Get Product
URL: /products
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 
[
{
"id":18,
"product_name":"Xerjoff Naxos",
"product_category":"Health & Beauty",
	"product_sub_category":"Fragrance",
	"product_price":7000000,
	"order_id_list":"25"
},
....
]
Add Product
URL: /products
Method: POST
Headers: “Authorization”: “Bearer <Token>”
Request Body: 
{
"product_name":"Xerjoff Naxos",
"product_category":"Health & Beauty",
	"product_sub_category":"Fragrance",
	"product_price":7000000,


}
Response:
{
 	"message": "Product with ID 21 added successfully"
}


Delete Product
URL: /products
Method: DELETE
Headers: “Authorization”: “Bearer <Token>”
Request Body: 
{
"id”: 1
}
Response:
{
 	"message": "Product with ID 1 deleted successfully"
}
Total Products
URL: /products/total
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 13
Customers
Get Customer
URL: /customers
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 
[
{
“id”: 1,
"customer_name": "John Doe",
"gender": "Male",
"age": 20,
"job": "Job",
"segment": "Consumer",
"total_spend": 0,
“churn”: “Churn”,
“segmentation”: “Diamond”
}
....
]
Add Customer
URL: /customers
Method: POST
Headers: “Authorization”: “Bearer <Token>”
Request Body: 
{
"customer_name": "John Doe",
"gender": "Male",
"age": 20,
"job": "Job",
"segment": "Consumer",
"total_spend": 0
}
Response:
{
 	"message": "Customer with ID 1 added successfully"
}


Delete Customer
URL: /customers
Method: DELETE
Headers: “Authorization”: “Bearer <Token>”
Request Body: 
{
"id”: 1
}
Response:
{
 	"message": "Customer with ID 1 deleted successfully"
}
Customer That Ordered Something
URL: /customers/ordered
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Total Customers
URL: /customers/total
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 10

Customer Churn
Url: /customer-churn
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 
[
{
"churn": "Churn",
"count": 1
	}, 
{
"churn": "Not Churn",
"count": 1
}
]

Customer Segmentation
Url: /customer-segmentation
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 
[
{
"count":4,
"segmentation":"Bronze"
},
{
"count":2,
"segmentation":"Diamond"
},
{
"count":3,
"segmentation":"Gold"
},
{
"count":6,
"segmentation":"Silver"
}
]

Insights
URL: /insights
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: 
[
{
"customer_id":1,
	"cust_name":"Andi Setiawan",
	"total_spend":20500000,
	"total_order_count":1,
	"segmentation":"Bronze",
	"churn":"Churn",
	"first_transaction":"2024-06-07T00:00:00.000Z",
	"last_transaction":"2024-06-07T00:00:00.000Z",
	"average_spend_per_month":"5500000",
	"days_as_customer":8,
	"months_as_customer":0,
	"years_as_customer":0
},
....
]

Revenues
Get Revenues
URL: /revenues
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Response: "897750000"
Get Monthly Revenues
URL: /revenues
Method: GET
Headers: “Authorization”: “Bearer <Token>”
Request Params: date_prefix=“2024-05”
Response: "897750000"



Auth
Register
URL: /auth/register
Method: POST
Request Body:
{
 	"username": "johndoe",
 	"fullname": "John Doe",
 	"email": "john@doe.com",
 	"password": "johndoe123"
}
Response:
{
 	"message": "Register Successful!"
}
Login
URL: /auth/login
Method: POST
Request Body:
{
"username": "johndoe",
"password": "johndoe123"
}
Response:
[
  {
    "id": 1,
    "username": "johndoe",
    "fullname": "John Doe",
    "email": "john@doe.com",
    "password": <Encrypted Password>
    "reset_token": <Encrypted Reset Token>,
    "reset_token_expiration": "2024-01-01T00:00:00.000"
  }
]
Forgot Password
URL: /auth/forgot-password
Method: POST
Request Body:
{
"email": "john@doe.com"
}
Response:
{
"message": "We sent a link to your email. Please check it!"
}
Reset Password
URL: /auth/reset-password
Method: POST
Request Body:
{
  "password": "newpassword123",
  "confirm_password": "newpassword123",
  "reset_token": <Secret Reset Token>
}
Response:
{
"message": "Password changed successfully!"
}
