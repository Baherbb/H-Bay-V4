import React from 'react';
import { Link } from 'react-router-dom';


interface Order {
  id: string;
  date: string;
  status: string;
  total: string;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: string;
  }[];
}

const orders: Order[] = [
  {
    id: '12345',
    date: 'January 20, 2024',
    status: 'Delivered',
    total: '$120.00',
    items: [
      {
        id: 'item1',
        name: 'Laptop',
        image: 'https://th.bing.com/th/id/OIP.Ix_6uKEOAmsXnhDbhqIadQHaHa?rs=1&pid=ImgDetMain',
        quantity: 2,
        price: '$600.00',
      },
      {
        id: 'item2',
        name: 'Product 2',
        image: 'https://www.vistaresidences.com.ph/assets/img/apple-iphone-15-philippines_condo-investing_11zon.jpg',
        quantity: 1,
        price: '$800.00',
      },
    ],
  },
  {
    id: '67890',
    date: 'January 15, 2024',
    status: 'Processing',
    total: '$500.00',
    items: [
      {
        id: 'item3',
        name: 'Product 3',
        image: 'https://th.bing.com/th/id/OIP.kaxrMzXTvyL-6Q-hLoiNGwHaHa?rs=1&pid=ImgDetMain',
        quantity: 1,
        price: '$80.00',
      },
    ],
  },
];

const OrderHistory: React.FC = () => {
  return (
    <div className="flex-1 bg-white">
      {/* Orange Header */}
      <div className="bg-orange-500 -mt-20 text-white px-6 py-3 shadow-md">
        <h1 className="text-3xl font-bold">Order History</h1>
        <p className="text-sm opacity-90">Review your past orders</p>
      </div>

      {/* Orders Section */}
      <div className="p-6 space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white p-4 shadow rounded-lg">
              {/* Order Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">Placed on {order.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Delivered'
                      ? 'bg-green-100 text-green-500'
                      : 'bg-orange-100 text-orange-500'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Order Items */}
              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-md border"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">{item.price}</p>
                  </div>
                ))}
              </div>

              
              <div className="mt-4 flex justify-between items-center border-t pt-4">
  <p className="text-sm font-bold">Total: {order.total}</p>
  
   

  {/* Order Tracking Link */}
  <Link
    to="/ordertracking"
  >
     <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300">
    View Details
  </button>
    
  </Link>
</div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <h2 className="text-lg font-bold text-gray-700">No Orders Yet</h2>
            <p className="text-sm text-gray-500">
              You haven’t placed any orders yet. Start shopping to view them here.
            </p>
            <button className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300">
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
