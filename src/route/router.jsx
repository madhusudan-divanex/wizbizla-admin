import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/root";
import Home from "../pages/home";
import CustomersList from "../pages/customers-list";
import CustomersCreate from "../pages/customers-create";
import LoginCreative from "../pages/login-creative";
import ProtectedRoute from "./ProtectedRoute";
import ErrorCreative from "../pages/error-creative";
import CreateCategory from "../pages/create-category";
import CustomersView from "../pages/customers-view";
import MembershipList from "../manual/MembershipList";
import CreateMembership from "../manual/CreateMembership";
import ViewMembership from "../manual/ViewMembership";
import AddOnList from "../manual/AddOnList";
import AddOnData from "../manual/AddOnData";
import UserList from "../manual/ProviderList";
import UserDetail from "../manual/UserDetail";
import MemberShipPurchaseList from "../manual/MemberShipPurchaseList";
import ConsumerList from "../manual/ConsumerList";
import ProviderList from "../manual/ProviderList";
import Category from "../manual/Category";
import CategoryData from "../manual/CategoryData";
import DeletedUser from "../manual/DeletedUser";
import ScamReport from "../manual/ScamReport";
import BookCustomer from "../manual/BookCustomers";
import PodcastSubscriber from "../manual/PodcastSubscribers";
import ContactQuery from "../manual/ContactQuery";
import SubCategory from "../manual/SubCategory";
import Advertisement from "../manual/Advertisement";
import References from "../manual/References";
import ConsumerDetail from "../manual/ConsumerDetail";
import AllUsers from "../manual/UserList";
import ServiceDispute from "../manual/ServiceDispute";
import Feedback from "../manual/Contact/Feedback";
import GetInTouch from "../manual/Contact/GetInTouch";
import Concern from "../manual/Contact/Concern";
import CustomizedService from "../manual/Contact/CustomizeService";
import BespokeService from "../manual/Contact/BespokeService";
import FrontEndContact from "../manual/FrontEndContact";
import ScamTip from "../manual/ScamTips";
import Faq from "../manual/Faq";
import BlogCategory from "../manual/BlogCategory";
import Blog from "../manual/Blog";
import NewsLetter from "../manual/NewsLetter";
import GetAddReferences from "../manual/GetAddReference";
import Chat from "../manual/Chat";
import ChatData from "../manual/ChatData";
import ScamType from "../manual/ScamType";
import ServiceCategory from "../manual/ServiceCategory";
import WelcomeBasket from "../manual/WelcomeBasket";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginCreative />,
    },
    {
        path: "*",
        element: <ErrorCreative />,
    },
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // {
            //     path: "/",
            //     element: <ProtectedRoute component={Home} />
            // },
            {
                path: "/",
                element: <ProtectedRoute component={CustomersList} />
            },
            {
                path: "/user/create",
                element: <ProtectedRoute component={CustomersCreate} />
            },
            {
                path: "/user/view/:id",
                element: <ProtectedRoute component={CustomersView} />
            },
            {
                path: "/categories/list",
                element: <ProtectedRoute component={CreateCategory} />
            },
            {
                path: "/membership",
                element: <ProtectedRoute component={MembershipList} />
            },
            {
                path: "/membership/create",
                element: <ProtectedRoute component={CreateMembership} />
            },
            {
                path: "/membership/view/:id",
                element: <ProtectedRoute component={ViewMembership} />
            },
            {
                path: "/add-on-services",
                element: <ProtectedRoute component={AddOnList} />
            },
            {
                path: "/chat",
                element: <ProtectedRoute component={Chat} />
            },
            {
                path: "/chat-data",
                element: <ProtectedRoute component={ChatData} />
            },
            {
                path: "/add-on-data",
                element: <ProtectedRoute component={AddOnData} />
            },
            {
                path: "/user/provider",
                element: <ProtectedRoute component={ProviderList} />
            },
            {
                path: "/user/consumer",
                element: <ProtectedRoute component={ConsumerList} />
            },
            {
                path: "/user/deleted-user",
                element: <ProtectedRoute component={DeletedUser} />
            },
            {
                path: "/user/detail/:id",
                element: <ProtectedRoute component={UserDetail} />
            },
            {
                path: "/membership-purchase",
                element: <ProtectedRoute component={MemberShipPurchaseList} />
            },
            {
                path: "/category",
                element: <ProtectedRoute component={Category} />
            },
            {
                path: "/sub-category",
                element: <ProtectedRoute component={SubCategory} />
            },
            {
                path: "/category-data",
                element: <ProtectedRoute component={CategoryData} />
            },
            {
                path: "/scam-report",
                element: <ProtectedRoute component={ScamReport} />
            },
            {
                path: "/book-customers",
                element: <ProtectedRoute component={BookCustomer} />
            },
            {
                path: "/podcast-subscribers",
                element: <ProtectedRoute component={PodcastSubscriber} />
            },
            {
                path: "/contact-query",
                element: <ProtectedRoute component={ContactQuery} />
            },
            {
                path: "/advertisement",
                element: <ProtectedRoute component={Advertisement} />
            },
            {
                path: "/references",
                element: <ProtectedRoute component={References} />
            },
             {
                path: "/get-add-references",
                element: <ProtectedRoute component={GetAddReferences} />
            },
            {
                path: "/consumer/detail/:id",
                element: <ProtectedRoute component={ConsumerDetail} />
            },
            {
                path: "/user/all",
                element: <ProtectedRoute component={AllUsers} />
            },
            {
                path: "/service-dispute",
                element: <ProtectedRoute component={ServiceDispute} />
            },
            {
                path: "/feedback",
                element: <ProtectedRoute component={Feedback} />
            },
            {
                path: "/get-in-touch",
                element: <ProtectedRoute component={GetInTouch} />
            },
            {
                path: "/concern",
                element: <ProtectedRoute component={Concern} />
            },
            {
                path: "/customized-service",
                element: <ProtectedRoute component={CustomizedService} />
            },
            {
                path: "/bespoke-concierge",
                element: <ProtectedRoute component={BespokeService} />
            },
            {
                path: "/newsletter",
                element: <ProtectedRoute component={NewsLetter} />
            },
            {
                path: "/cms/contact",
                element: <ProtectedRoute component={FrontEndContact} />
            },
            {
                path: "/cms/scam-tip",
                element: <ProtectedRoute component={ScamTip} />
            },
            {
                path: "/scam-type",
                element: <ProtectedRoute component={ScamType} />
            },
            {
                path: "/welcome-basket",
                element: <ProtectedRoute component={WelcomeBasket} />
            },
            {
                path: "/service-category",
                element: <ProtectedRoute component={ServiceCategory} />
            },
             {
                path: "/cms/faq",
                element: <ProtectedRoute component={Faq} />
            },
            {
                path: "/cms/blog-category",
                element: <ProtectedRoute component={BlogCategory} />
            },
            {
                path: "/cms/blog",
                element: <ProtectedRoute component={Blog} />
            },
        ]

    },
])

