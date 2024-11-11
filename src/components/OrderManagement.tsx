import React, { useEffect, useState } from 'react'
import { Customer, Order, Product } from '../data/types'
import { loadCSVData } from '../services/dataService'
import GenericTable from './GenericTable'
import { ColumnDef } from '@tanstack/react-table'
import { formatCurrency } from '../utils/formatCurrency'
import OrderForm from './OrderForm'

interface TotalAmountByCustomer {
  customerId: string
  customerName: string
  totalAmount: number
}

const fetchOrders = async (): Promise<Order[]> => {
  return await loadCSVData<Order>('/data/orders.csv')
}

const fetchCustomers = async (): Promise<Customer[]> => {
  return await loadCSVData<Customer>('/data/customer.csv')
}

const fetchProducts = async (): Promise<Product[]> => {
  return await loadCSVData<Product>('/data/products.csv')
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [editingOrder, setEditingOrder] = useState<Order | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, customersData, productsData] = await Promise.all([
          fetchOrders(),
          fetchCustomers(),
          fetchProducts(),
        ])
        setOrders(ordersData)
        setCustomers(customersData)
        setProducts(productsData)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    fetchData()
  }, [])

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.orderId === updatedOrder.orderId ? updatedOrder : order))
    )
    // איפוס ההזמנה לעריכה
    setEditingOrder(null)
  }

  const deleteOrder = (orderId: string) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId))
  }

  const addOrder = (order: Omit<Order, 'orderId'>) => {
    const newOrderId = (Math.max(0, ...orders.map((o) => Number(o.orderId))) + 1).toString()
    const newOrder: Order = { ...order, orderId: newOrderId }
    setOrders((prevOrders) => [...prevOrders, newOrder])
  }

  const customerMap = React.useMemo(() => {
    return new Map(customers.map((c) => [c.customerId, c]))
  }, [customers])

  const productMap = React.useMemo(() => {
    return new Map(products.map((p) => [p.productId, p]))
  }, [products])

  const totalAmount = React.useMemo(() => {
    return orders.reduce((sum, order) => {
      const product = productMap.get(order.productId)
      const quantity = order.quantity
      const amount = product ? product.price * Number(quantity) : 0
      return sum + amount
    }, 0)
  }, [orders, productMap])

  const totalAmountByCustomer = React.useMemo(() => {
    const customerTotals = new Map<string, number>()

    orders.forEach((order) => {
      const customerId = order.customerId
      const product = productMap.get(order.productId)
      const quantity = order.quantity
      const amount = product ? product.price * Number(quantity) : 0

      if (customerTotals.has(customerId)) {
        customerTotals.set(customerId, customerTotals.get(customerId)! + amount)
      } else {
        customerTotals.set(customerId, amount)
      }
    })

    return customerTotals
  }, [orders, productMap])

  const totalAmountByCustomerData = React.useMemo<TotalAmountByCustomer[]>(() => {
    return Array.from(totalAmountByCustomer.entries()).map(([customerId, amount]) => {
      const customerName = customerMap.get(customerId)?.customerName || 'לא ידוע'
      return {
        customerId,
        customerName,
        totalAmount: amount,
      }
    })
  }, [totalAmountByCustomer, customerMap])

  const columnsTotalAmountByCustomer = React.useMemo<ColumnDef<TotalAmountByCustomer>[]>(
    () => [
      {
        header: 'שם הלקוח',
        accessorKey: 'customerName',
        filterFn: 'includesString',
        sortingFn: 'alphanumeric',
      },
      {
        header: 'סכום כולל',
        accessorKey: 'totalAmount',
        cell: (info) => {
          const amount = info.getValue<number>()
          return formatCurrency(amount)
        },
        sortingFn: 'alphanumeric',
      },
    ],
    []
  )

  const columnsOrders = React.useMemo<ColumnDef<Order>[]>(
    () => [
      {
        header: 'מספר הזמנה',
        accessorKey: 'orderId',
        filterFn: 'includesString',
        sortingFn: 'alphanumeric',
      },
      {
        header: 'שם הלקוח',
        accessorKey: 'customerId',
        accessorFn: (row) => {
          const customerId = row.customerId
          const customer = customerMap.get(customerId)
          return customer ? customer.customerName : 'לא ידוע'
        },
        filterFn: 'includesString',
        sortingFn: 'textCaseSensitive',
      },
      {
        header: 'תאריך הזמנה',
        accessorKey: 'orderDate',
        sortingFn: 'datetime',
      },
      {
        header: 'כמות',
        accessorKey: 'quantity',
      },
      {
        header: 'תיאור המוצר',
        id: 'productLabel',
        accessorFn: (row) => {
          const productId = row.productId
          const product = productMap.get(productId)
          return product ? product.productName : 'לא נמצא'
        },
        accessorKey: 'productId',
        filterFn: 'includesStringSensitive',
      },
      {
        header: 'מחיר ליחידה',
        id: 'amount pre item',
        accessorFn: (row) => {
          const productId = row.productId
          const product = productMap.get(productId)
          return product ? formatCurrency(product.price) : 'לא נמצא'
        },
        sortingFn: 'alphanumeric',
        filterFn: 'includesString',
        accessorKey: 'productId',
      },
      {
        header: 'סכום כולל',
        id: 'amount',
        accessorFn: (row) => {
          const productId = row.productId
          const product = productMap.get(productId)
          return product ? formatCurrency(product.price * Number(row.quantity)) : 'לא נמצא'
        },
        sortingFn: 'alphanumeric',
        filterFn: 'includesString',
        accessorKey: 'productId',
      },

      {
        header: 'פעולות',
        cell: (info) => {
          const row = info.row.original
          return (
            <>
              <button onClick={() => setEditingOrder(row)}>ערוך</button>
              <button onClick={() => deleteOrder(row.orderId)}>מחק</button>
            </>
          )
        },
      },
    ],
    [customerMap, productMap]
  )

  return (
    <div>
      <h2>רשימת הזמנות</h2>
      <OrderForm
        customers={customers}
        products={products}
        onAddOrder={addOrder}
        onUpdateOrder={updateOrder}
        orders={orders}
        editingOrder={editingOrder}
      />
      <GenericTable<Order> columns={columnsOrders} data={orders} />
      <div>
        <h3>סך כל ההזמנות: {formatCurrency(totalAmount)}</h3>
      </div>
      <GenericTable<TotalAmountByCustomer> columns={columnsTotalAmountByCustomer} data={totalAmountByCustomerData} />
    </div>
  )
}

export default OrderManagement
