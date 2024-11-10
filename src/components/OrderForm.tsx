// src/components/AddOrderForm.tsx

import React, { useEffect, useState } from 'react';
import { Customer, Order, Product } from '../data/types';

interface AddOrderFormProps {
    onAddOrder: (order: Order) => void;
    onUpdateOrder: (order: Order) => void;
    customers: Customer[];
    products: Product[];
    orders: Order[]
    editingOrder: Order | null
}

const OrderForm: React.FC<AddOrderFormProps> = ({ onAddOrder, onUpdateOrder, customers, products, editingOrder }) => {
    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [orderDate, setOrderDate] = useState("");
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        if (editingOrder) {
            setCustomerId(editingOrder.customerId);
            setProductId(editingOrder.productId);
            setOrderDate(editingOrder.orderDate);
        }
    }, [editingOrder]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        const newOrder: Order = {
            orderId: editingOrder?.orderId || "",
            customerId,
            productId,
            orderDate,
            quantity,
        };

        if (editingOrder) {
            // עדכון הזמנה קיימת

            onUpdateOrder(newOrder);
        } else {
            // הוספת הזמנה חדשה

            onAddOrder(newOrder);
        }


        setCustomerId('');
        setProductId('');
        setOrderDate('');
        setQuantity('')
    };

    return (
        <form onSubmit={handleSubmit}>
            {!editingOrder ? <h3>הוסף הזמנה חדשה</h3> : <h3>ערוך הזמנה קיימת</h3>}
            <div>
                <label>לקוח:</label>
                <select value={customerId} onChange={e => setCustomerId(e.target.value)} required>
                    <option value="">בחר לקוח</option>
                    {customers.map(customer => (
                        <option key={customer.customerId} value={customer.customerId}>
                            {customer.customerName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>מוצר:</label>
                <select value={productId} onChange={e => setProductId(e.target.value)} required>
                    <option value="">בחר מוצר</option>
                    {products.map(product => (
                        <option key={product.productId} value={product.productId}>
                            {product.productName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>כמות:</label>
                <select value={quantity} onChange={e => setQuantity(e.target.value)} required>
                    <option value={''}>בחר כמות</option>
                    {['1', '2', '3', '4', '5'].map(quantity => (
                        <option key={quantity} value={quantity}>
                            {quantity}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>תאריך הזמנה:</label>
                <input
                    type="date"
                    value={orderDate}
                    onChange={e => setOrderDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{editingOrder ? 'ערוך הזמנה' : 'הוסף הזמנה'}</button>
        </form>
    );
};

export default OrderForm;
