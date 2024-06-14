# Technical Document Point of Sales 02

## Petunjuk Development
### Step 1 : Clone dari github repository Website Point of Sales 02
Sebelum memulai, buat file _**.env.local**_ pada root directory seperti kode di bawah ini. Pastikan anda telah membuat database MySQL, dan akun Google untuk menggunakan Gmail OAuth sudah terdefinisi dengan baik

```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secret_key>
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=<password_db>
DB_NAME=<nama_db>
EMAIL_USER=<email_gmail_oauth>
CLIENT_ID=<client_id_gmail_oauth>
CLIENT_SECRET=<client_id_gmail_oauth>
GMAIL_REFRESH_TOKEN=<client_id_gmail_oauth>
NEXT_PUBLIC_FAST_API_URL=http://127.0.0.1:8000
```

### Step 2 : Install Dependencies
Jalankan perintah _**npm install**_ untuk menginstall dependencies pada package.json.

### Step 3 : Start the Application
Anda dapat menjalankan aplikasi dengan menjalankan perintah _**npm run dev**_.


# API Documentation

## Authentication

### Register
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "fullname": "John Doe",
    "email": "john@doe.com",
    "password": "johndoe123"
  }
- **Response**:
  ```json
  {
    "message": "Register Successful!"
  }
  ```

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "password": "johndoe123"
  }
  ```
- **Response**:
  ```json
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
  ```

### Forgot Password
- **URL**: `/auth/forgot-password`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john@doe.com"
  }
  ```
- **Response**:
  ```json
  {
    "message": "We sent a link to your email. Please check it!"
  }
  ```

### Reset Password
- **URL**: `/auth/reset-password`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "password": "newpassword123",
    "confirm_password": "newpassword123",
    "reset_token": <Secret Reset Token>
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password changed successfully!"
  }
  ```


## Order
### Get Order
- **URL**: `/orders`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "order_date": "2024-01-01",
      "ship_date": "2024-01-01",
      "customer_id": 1,
      "product_id": 1,
      "quantity": 1,
      "sales": 100000
    },
	]
  ```
### Add Order
- **URL**: `/orders`
- **Method**: `POST`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Request Body**:
  ```json
  {
    "order_date": "2024-01-01",
    "ship_date": "2024-01-01",
    "customer_id": 1,
    "product_id": 1,
    "quantity": 1,
    "sales": 100000
  }
  ```
- **Response**:
  ```json
  {
    "message": "Order with ID 1 added successfully"
  }
  ```

### Delete Order
- **URL**: `/orders`
- **Method**: `DELETE`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Request Body**:
  ```json
  {
    "id": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Order with ID 1 deleted successfully"
  }
  ```

### Total Order
- **URL**: `/orders/total`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Response**: ```18```


### Monthly Order
- **URL**: `/orders/monthly`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Request Params**: ```date_prefix="2024-05"```
- **Response**: ```100000000```


## Product
### Get Product
- **URL**: `/products`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Response**:
  ```json
  [
    {
      "id":18,
      "product_name":"Xerjoff Naxos",
      "product_category":"Health & Beauty",
      "product_sub_category":"Fragrance",
      "product_price":7000000,
      "order_id_list":"25"
    },
	]
  ```
### Add Product
- **URL**: `/products`
- **Method**: `POST`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Request Body**:
  ```json
  {
    "product_name":"Xerjoff Naxos",
    "product_category":"Health & Beauty",
    "product_sub_category":"Fragrance",
    "product_price":7000000,
  }
  ```
- **Response**:
  ```json
  {
    "message": "Product with ID 1 added successfully"
  }
  ```

### Delete Product
- **URL**: `/products`
- **Method**: `DELETE`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Request Body**:
  ```json
  {
    "id": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Product with ID 1 deleted successfully"
  }
  ```

### Total Product
- **URL**: `/products/total`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Response**: ```13```



## Customer
### Get Customer
- **URL**: `/customers`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Response**:
  ```json
  [
    {
      “id”: 1,
      "customer_name": "John Doe",
      "gender": "Male",
      "age": 20,
      "job": "Job",
      "segment": "Consumer",
      "total_spend": 0,
      "churn": "Churn",
      "segmentation": "Diamond"
    },
	]
  ```
### Add Customer
- **URL**: `/customers`
- **Method**: `POST`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Request Body**:
  ```json
  {
    "customer_name": "John Doe",
    "gender": "Male",
    "age": 20,
    "job": "Job",
    "segment": "Consumer",
    "total_spend": 0
  }
  ```
- **Response**:
  ```json
  {
    "message": "Customer with ID 1 added successfully"
  }
  ```

### Delete Customer
- **URL**: `/customers`
- **Method**: `DELETE`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Request Body**:
  ```json
  {
    "id": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Customer with ID 1 deleted successfully"
  }
  ```

### Customers that Ordered Something
- **URL**: `/customers/ordered`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Response**: ```[1,2,3,4,5,6,7,8,9,20]```

### Total Customer
- **URL**: `/customers/total`
- **Method**: `GET`
- **Headers**: `“Authorization”: “Bearer <Token>”`
- **Response**: ```10```







