
export interface Customer {
    customerId: string;
    customerName: string;
    email: string;
    phone: string;
}

export interface Product {
    productId: string;
    productName: string;
    category: string;
    price: number;
}

export interface Order {
    orderId: string;
    customerId: string;
    productId: string
    orderDate: string;
    quantity: string
}

export interface OrderItem {
    orderItemId: string;
    orderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface Category {
    categoryId: string;
    categoryName: string;
}
