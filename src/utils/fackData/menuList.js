export const menuList = [
    // {
    //     id: 0,
    //     name: "dashboards",
    //     path: "/",
    //     icon: 'feather-airplay',
    // },
    {
        id: 1,
        name: "Onboarding Form ",
        path: "/",
        icon: 'fa-form',
        // dropdownMenu: [
        //     {
        //         id: 1,
        //         name: "List",
        //         path: "/",
        //         subdropdownMenu: false
        //     },
        //     // {
        //     //     id: 2,
        //     //     name: "User Create",
        //     //     path: "/user/create",
        //     //     subdropdownMenu: false
        //     // }
        // ]
    },
    // {
    //     id: 2,
    //     name: "MemberShip ",
    //     path: "#",
    //     icon: 'fa-vip',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "List",
    //             path: "/membership",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Purchase List",
    //             path: "/membership-purchase",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Create",
    //             path: "/membership/create",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Add on Service",
    //             path: "/add-on-services",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    // {
    //     id: 3,
    //     name: "Users ",
    //     path: "#",
    //     icon: 'feather-users',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Consumers",
    //             path: "/user/consumer",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Providers",
    //             path: "/user/provider",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Deleted User",
    //             path: "/user/deleted-user",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Book Customer",
    //             path: "/book-customers",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 5,
    //             name: "Podcast Subscribers",
    //             path: "/podcast-subscribers",
    //             subdropdownMenu: false
    //         }
    //     ]
    // },
    {
        id: 3,
        name: "Service Provider",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "Pending Accreditation",
                path: "/user/provider?data=pending",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "All Providers",
                path: "/user/provider?data=provider",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Pending Trade License Accreditation",
                path: "/user/provider?data=license",
                subdropdownMenu: false
            },
            
        ]
    },
    // {
    //     id: 4,
    //     name: "Wizbizla ",
    //     path: "#",
    //     icon: 'fa-puzzel',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Category",
    //             path: "/category",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "Sub Category",
    //             path: "/sub-category",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 3,
    //             name: "Contact",
    //             path: "/cms/contact",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 4,
    //             name: "Scam Tip",
    //             path: "/cms/scam-tip",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 5,
    //             name: "Faq",
    //             path: "/cms/faq",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 6,
    //             name: "Blog Category",
    //             path: "/cms/blog-category",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 6,
    //             name: "Blog",
    //             path: "/cms/blog",
    //             subdropdownMenu: false
    //         },
            
    //     ]
    // },
    {
        id: 4,
        name: "All Users ",
        path: "#",
        icon: 'fa-users',
        dropdownMenu: [
            {
                id: 1,
                name: "All Users",
                path: "/user/all",
                subdropdownMenu: false
            },
            // {
            //     id: 2,
            //     name: "Consumers",
            //     path: "/user/consumer",
            //     subdropdownMenu: false
            // },
            // {
            //     id: 3,
            //     name: "Deleted User",
            //     path: "/user/deleted-user",
            //     subdropdownMenu: false
            // },
            // {
            //     id: 4,
            //     name: "Book Customer",
            //     path: "/book-customers",
            //     subdropdownMenu: false
            // },
            // {
            //     id: 5,
            //     name: "Podcast Subscribers",
            //     path: "/podcast-subscribers",
            //     subdropdownMenu: false
            // }
            // {
            //     id: 1,
            //     name: "Sub Category",
            //     path: "/sub-category",
            //     subdropdownMenu: false
            // },
            
        ]
    },
    // {
    //     id: 6,
    //     name: "Provider Data",
    //     path: "#",
    //     icon: 'fa-user-house',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Advertisement",
    //             path: "/advertisement",
    //             subdropdownMenu: false
    //         },
    //         {
    //             id: 2,
    //             name: "References",
    //             path: "/references",
    //             subdropdownMenu: false
    //         },
            
    //     ]
    // },
    // {
    //     id: 6,
    //     name: "Scam ",
    //     path: "#",
    //     icon: 'fa-scam',
    //     dropdownMenu: [
    //         {
    //             id: 1,
    //             name: "Reported Scam",
    //             path: "/scam-report",
    //             subdropdownMenu: false
    //         },
            
    //     ]
    // },
    {
        id: 6,
        name: "Scam Posting Story",
        path: "#",
        icon: 'fa-scam',
        dropdownMenu: [
            {
                id: 1,
                name: "All Scam Submissions",
                path: "/scam-report",
                subdropdownMenu: false
            },
            
        ]
    },
    {
        id: 3,
        name: "Subscribers ",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 4,
                name: "Blog",
                path: "/newsletter",
                subdropdownMenu: false
            },
            {
                id: 5,
                name: "Podcast ",
                path: "/podcast-subscribers",
                subdropdownMenu: false
            }
        ]
    },
     {
        id: 2,
        name: "Service Request ",
        path: "#",
        icon: 'fa-pray',
        dropdownMenu: [
            {
                id: 1,
                name: "Bespoke Concierge Service",
                path: "/bespoke-concierge",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Customized Due Diligence Service",
                path: "/customized-service",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Service Dispute",
                path: "/service-dispute",
                subdropdownMenu: false
            },           
            
            
        ]
    },
     {
        id: 7,
        name: "Advertisement",
        path: "#",
        icon: 'fa-ad',
        dropdownMenu: [
            // {
            //     id: 1,
            //     name: "References",
            //     path: "/references",
            //     subdropdownMenu: false
            // },
             {
                id: 2,
                name: "Requests",
                path: "/advertisement",
                subdropdownMenu: false
            },
        ]
     },
      {
        id: 8,
        name: "Welcome Baske",
        path: "#",
        icon: 'fa-basket',
        dropdownMenu: [
            // {
            //     id: 1,
            //     name: "References",
            //     path: "/references",
            //     subdropdownMenu: false
            // },
             {
                id: 2,
                name: "Requests",
                path: "",
                subdropdownMenu: false
            },
        ]
     },
     {
        id: 8,
        name: "Reference",
        path: "#",
        icon: 'feather-users',
        dropdownMenu: [
            {
                id: 1,
                name: "References",
                path: "/get-add-references",
                subdropdownMenu: false
            },
             {
                id: 2,
                name: "Signature Profile References",
                path: "/references",
                subdropdownMenu: false
            },
        ]
     },
     {
        id: 9,
        name: "Blog",
        path: "#",
        icon: 'fa-blog',
        dropdownMenu: [
            {
                id: 1,
                name: "Blogs",
                path: "/cms/blog",
                subdropdownMenu: false
            },
             {
                id: 2,
                name: "Add New Blog",
                path: "/cms/blog?create=true",
                subdropdownMenu: false
            },
        ]
     },
     {
        id: 10,
        name: "Chat",
        path: "#",
        icon: 'fa-chat',
        dropdownMenu: [
            {
                id: 1,
                name: "Chat",
                path: "/chat",
                subdropdownMenu: false
            },
        ]
     },
     {
        id: 10,
        name: "General Pages",
        path: "#",
        icon: 'fa-general',
        dropdownMenu: [
            {
                id: 1,
                name: "Faq",
                path: "/cms/faq",
                subdropdownMenu: false
            },
             {
                id: 2,
                name: "Scam Tip",
                path: "/cms/scam-tip",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Purchase List",
                path: "/membership-purchase",
                subdropdownMenu: false
            },
            {
                id: 4,
                name: "Consumers",
                path: "/user/consumer",
                subdropdownMenu: false
            },
            {
                id: 6,
                name: "Deleted User",
                path: "/user/deleted-user",
                subdropdownMenu: false
            },
             {
                id: 7,
                name: "Blog Category",
                path: "/cms/blog-category",
                subdropdownMenu: false
            },
        ]
     },
     {
        id: 7,
        name: "Contact ",
        path: "#",
        icon: 'fa-contact',
        dropdownMenu: [
            {
                id: 1,
                name: "Contact",
                path: "/contact-query",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Get in Touch",
                path: "/get-in-touch",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Feedback",
                path: "/feedback",
                subdropdownMenu: false
            },
            {
                id: 3,
                name: "Concern",
                path: "/concern",
                subdropdownMenu: false
            },
            
            
        ]
    },
    {id:3,
        name:"Setting",
        icon:'feather-setting'
    },
    {
        id: 8,
        name: "MemberShip ",
        path: "#",
        icon: 'fa-m',
        dropdownMenu: [
            {
                id: 1,
                name: "Package",
                path: "/membership",
                subdropdownMenu: false
            },
            // {
            //     id: 2,
            //     name: "Purchase List",
            //     path: "/membership-purchase",
            //     subdropdownMenu: false
            // },
            {
                id: 2,
                name: "Add on Service",
                path: "/add-on-services",
                subdropdownMenu: false
            }
        ]
    },
    {
        id: 9,
        name: "Categor",
        path: "#",
        icon: 'fa-puzzel',
        dropdownMenu: [
            {
                id: 1,
                name: "Category",
                path: "/category",
                subdropdownMenu: false
            },
            {
                id: 2,
                name: "Sub Category",
                path: "/sub-category",
                subdropdownMenu: false
            },
           
            
        ]
    },
    
    
]
