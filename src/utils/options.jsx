const customerViewOptions = [
    { value: "sms", label: "SMS", icon: "feather-smart-phone" },
    { value: "push", label: "Push", icon: "feather-bell" },
    { value: "email", label: "Email", icon: "feather-mail" },
    { value: "repeat", label: "Repeat", icon: "feather-repeat" },
    { value: "deactivate", label: "Deactivate", icon: "feather-bell-off" },
    { value: "sms-push", label: "SMS + Push", icon: "feather-smart-phone" },
    { value: "email-push", label: "Email + Push", icon: "feather-mail" },
    { value: "sms-email", label: "SMS + Email", icon: "feather-smart-phone" },
    { value: "sms-push-email", label: "SMS + Push + Email", icon: "feather-smart-phone" },
]

const customerListTagsOptions = [
    { value: 'vip', label: 'VIP', color: '#17c666' },
    { value: 'bugs', label: 'Bugs', color: '#3dc7be' },
    { value: 'team', label: 'Team', color: '#3454d1' },
    { value: 'updates', label: 'Updates', color: '#17c666' },
    { value: 'personal', label: 'Personal', color: '#ffa21d' },
    { value: 'promotions', label: 'Promotions', color: '#ea4d4d' },
    { value: 'high-budget', label: 'High Budget', color: '#41b2c4' },
    { value: 'customs', label: 'Customs', color: '#6610f2' },
    { value: 'low-budget', label: 'Low Budget', color: '#ea4d4d' },
    { value: 'wholesale', label: 'Wholesale', color: '#3454d1' },
    { value: 'primary', label: 'Primary', color: '#41b2c4' },
];
const customerListStatusOptions = [
    { value: 'active', label: 'Active', color: '#17c666' },
    { value: 'inactive', label: 'Inactive', color: '#ffa21d' },
    { value: 'declined', label: 'Declined', color: '#ea4d4d' },
];
const customerCreatePrivacyOptions = [
    { value: 'onlyme', label: 'Only Me', icon: 'feather-lock' },
    { value: 'everyone', label: 'Everyone', icon: 'feather-globe' },
    { value: 'anonymous', label: 'Anonymous', icon: 'feather-users' },
    { value: 'ifollow', label: 'People I Follow', icon: 'feather-user-check' },
    { value: 'followme', label: 'People Follow Me', icon: 'feather-eye' },
    { value: 'customselectever', label: 'Custom Select Ever', icon: 'feather-settings' }
];

export {
    customerViewOptions,
    customerListTagsOptions,
    customerListStatusOptions,
    customerCreatePrivacyOptions,
}