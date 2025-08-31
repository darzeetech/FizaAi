// import { createBrowserRouter } from 'react-router-dom';

// import Dashboard from '../pages/dashboard';
// import Login from '../pages/signin';
// import Profile from '../pages/profile';
// import CustomerList from '../pages/Customer/CustomerList';
// import CreateOrder from '../pages/Order/CreateOrder';
// import OrderList from '../pages/Order/OrderList';

// import PublicWrapper from './PublicWrapper';
// import PrivateWrapper from './PrivateWrapper';
// import Addcustomer from '../pages/Customer/CustomerList/Addcustomer';
// import CustomerOrders from '../pages/Customer/CustomerList/CustomerOrders';
// import Editcustomer from '../pages/Customer/CustomerList/Editcustomer';
// import updateProfile from '../pages/profile/updateProfile';
// import Invoicepdf from '../pages/Invoicepdf';
// import ItemDetails from '../pages/ItemDetails';
// import Invoice from '../pages/Invoice';
// import Imagegenerate from '../pages/Imagegenerate';
// import FizaAI from '../pages/Fizaai/aifiza';

// const allRoutes = [
//   {
//     path: '/',
//     element: <PublicWrapper Content={Login} />,
//   },
//   {
//     path: '/login',
//     element: <PublicWrapper Content={Login} />,
//   },
//   {
//     path: '/onboarding',
//     element: <PublicWrapper Content={Profile} />,
//   },
//   {
//     path: '/profile',
//     element: <PrivateWrapper Content={Profile} />,
//   },
//   {
//     path: '/editprofile',
//     element: <PrivateWrapper Content={updateProfile} />,
//   },
//   {
//     path: '/dashboard',
//     element: <PrivateWrapper Content={Dashboard} />,
//   },
//   {
//     path: '/orders-list',
//     element: <PrivateWrapper Content={OrderList} />,
//   },
//   {
//     path: '/customers',
//     element: <PrivateWrapper Content={CustomerList} />,
//   },
//   {
//     path: '/selectcustomer',
//     element: <PrivateWrapper Content={CustomerOrders} />,
//   },
//   {
//     path: '/addcustomer',
//     element: <PrivateWrapper Content={Addcustomer} />,
//   },
//   {
//     path: '/editcustomer',
//     element: <PrivateWrapper Content={Editcustomer} />,
//   },
//   {
//     path: '/select-customer',
//     element: <PrivateWrapper Content={CreateOrder} />,
//   },
//   {
//     path: '/select-outfit',
//     element: <PrivateWrapper Content={CreateOrder} />,
//   },
//   {
//     path: '/orders/:id?/:itemId?',
//     element: <PrivateWrapper Content={CreateOrder} />,
//   },
//   {
//     path: '/order_tracking/:tracking_id?/is_invoice=true',
//     element: <PublicWrapper Content={Invoice} showHeader={false} />,
//   },
//   {
//     path: '/order_tracking/:tracking_id?',
//     element: <PublicWrapper Content={Invoicepdf} showHeader={false} />,
//   },
//   {
//     path: '/item_detail_tracking/:tracking_id?',
//     element: <PublicWrapper Content={ItemDetails} showHeader={false} />,
//   },
//   {
//     path: '/image',
//     element: <PublicWrapper Content={Imagegenerate} showHeader={false} />,
//   },
//   {
//     path: '/aifiza',
//     element: <PublicWrapper Content={FizaAI} showHeader={false} />,
//   },
// ];

// const routes = createBrowserRouter(
//   allRoutes.map((route) => {
//     return route;
//   })
// );

// export default routes;

import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './RootLayout'; // adjust path as necessary

// import Dashboard from '../pages/dashboard';
// import Login from '../pages/signin';
// import Profile from '../pages/profile';
// import CustomerList from '../pages/Customer/CustomerList';
import CreateOrder from '../pages/Order/CreateOrder';
// import OrderList from '../pages/Order/OrderList';

import PublicWrapper from './PublicWrapper';
import PrivateWrapper from './PrivateWrapper';
// import Addcustomer from '../pages/Customer/CustomerList/Addcustomer';
// import CustomerOrders from '../pages/Customer/CustomerList/CustomerOrders';
// import Editcustomer from '../pages/Customer/CustomerList/Editcustomer';
// import updateProfile from '../pages/profile/updateProfile';
// import Invoicepdf from '../pages/Invoicepdf';
// import ItemDetails from '../pages/ItemDetails';
// import Invoice from '../pages/Invoice';

import FizaAI from '../pages/Fizaai/aifiza';
import ShareFizaai from '../pages/Fizaai/shareFizaai'; // Ensure this import is correct

const allRoutes = [
  {
    path: '/',
    element: <RootLayout />, // Root layout with FaviconController and Outlet
    children: [
      // { path: 'login', element: <PublicWrapper Content={Login} /> },
      // { path: 'login', element: <PublicWrapper Content={Login} /> },
      // { path: 'onboarding', element: <PublicWrapper Content={Profile} /> },
      // { path: 'profile', element: <PrivateWrapper Content={Profile} /> },
      // { path: 'editprofile', element: <PrivateWrapper Content={updateProfile} /> },
      // { path: 'dashboard', element: <PrivateWrapper Content={Dashboard} /> },
      // { path: 'orders-list', element: <PrivateWrapper Content={OrderList} /> },
      // { path: 'customers', element: <PrivateWrapper Content={CustomerList} /> },
      // { path: 'selectcustomer', element: <PrivateWrapper Content={CustomerOrders} /> },
      // { path: 'addcustomer', element: <PrivateWrapper Content={Addcustomer} /> },
      // { path: 'editcustomer', element: <PrivateWrapper Content={Editcustomer} /> },
      // { path: 'select-customer', element: <PrivateWrapper Content={CreateOrder} /> },
      { path: 'select-outfit', element: <PrivateWrapper Content={CreateOrder} /> },
      // { path: 'orders/:id?/:itemId?', element: <PrivateWrapper Content={CreateOrder} /> },
      // {
      //   path: 'order_tracking/:tracking_id?/is_invoice=true',
      //   element: <PublicWrapper Content={Invoice} showHeader={false} />,
      // },
      // {
      //   path: 'order_tracking/:tracking_id?',
      //   element: <PublicWrapper Content={Invoicepdf} showHeader={false} />,
      // },
      // {
      //   path: 'item_detail_tracking/:tracking_id?',
      //   element: <PublicWrapper Content={ItemDetails} showHeader={false} />,
      // },

      { path: '', element: <PublicWrapper Content={FizaAI} showHeader={false} /> },
      {
        path: '/:idd/:id',
        element: <PublicWrapper Content={ShareFizaai} showHeader={false} />,
      },
    ],
  },
];

const routes = createBrowserRouter(allRoutes);

export default routes;
