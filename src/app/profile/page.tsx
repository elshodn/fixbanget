'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Trash2, UserRound, Shield, HelpCircle, ListOrdered } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { ProfileComponent } from "@/components/profileComponent/index";
// import { ProfileOrdersComponent } from "../components/profileOrders";
// import { TermsComponent } from "../components/termsComponent";
// import { PrivacyComponent } from "../components/privacyComponent";
// import { HelpComponent } from "../components/helpComponent";
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const Profile: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('profile');
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState<boolean>(false);
    const { logout } = useAuthStore();
    const router = useRouter();

    const menuItems = [
        { id: 'profile', icon: <UserRound size={18} />, label: 'Профиль' },
        { id: 'orders', icon: <ListOrdered size={18} />, label: 'Список заказов' },
        { id: 'terms', icon: <Shield size={18} />, label: 'Срок и условие' },
        { id: 'privacy', icon: <Shield size={18} />, label: 'Политика конфиденциальности' },
        { id: 'help', icon: <HelpCircle size={18} />, label: 'Страница помощи' },
    ];

    const handleLogout = () => {
        logout();
        router.push("/");
        alert('User logged out');
        setShowLogoutDialog(false);
    };

    const handleDeleteAccount = () => {
        logout();
        router.push("/");
        alert('Account deleted');
        setShowDeleteDialog(false);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileComponent />;
            case 'orders':
                // return <ProfileOrdersComponent />;
            case 'terms':
                // return <TermsComponent />;
            case 'privacy':
                // return <PrivacyComponent />;
            case 'help':
                // return <HelpComponent />;
            default:
                return <ProfileComponent />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="w-11/12 max-w-7xl mx-auto py-10 md:py-20">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Профиль</h1>
                    {activeTab === "profile" && (
                        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <DialogTrigger asChild>
                                <span
                                    className="text-[#F04438] border p-2 cursor-pointer bg-white rounded-md hover:text-[#F04438] hover:bg-red-50 flex items-center gap-1"
                                >
                                    <Trash2 size={16} /> Удалить аккаунт
                                </span>
                            </DialogTrigger>
                            <DialogContent className="w-[90%] sm:w-[450px]">
                                <DialogHeader className="space-y-4">
                                    <DialogTitle className="text-center">Удалить аккаунт</DialogTitle>
                                    <DialogDescription className="text-center">
                                        Вы уверены, что хотите удалить свою учетную запись? Это действие нельзя отменить.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-4 flex flex-row gap-2">
                                    <Button
                                        onClick={handleDeleteAccount}
                                        className="flex-1 bg-[#FF385C] text-white py-6 text-base font-semibold"
                                    >
                                        Удалить
                                    </Button>
                                    <Button
                                        onClick={() => setShowDeleteDialog(false)}
                                        className="flex-1 bg-transparent text-black border border-black py-6 text-base font-semibold"
                                    >
                                        Отмена
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/4 bg-white p-3 rounded-lg h-max shadow-sm">
                        <div className="space-y-1 md:space-y-0 md:block flex overflow-x-auto pb-2 md:pb-0 w-full">
                            <div className="flex flex-nowrap md:flex-col gap-2 md:gap-0">
                                {menuItems.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant={activeTab === item.id ? 'secondary' : 'outline'}
                                        className="w-max md:w-full justify-start text-start my-2 md:my-0.5 gap-2 whitespace-normal"
                                        onClick={() => setActiveTab(item.id)}
                                    >
                                        {item.icon} {item.label}
                                    </Button>
                                ))}

                                <Separator className="my-2 md:block hidden" />

                                <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                                    <DialogTrigger asChild>
                                        <span
                                            className="w-max md:w-full flex p-3 items-center my-2 md:my-0 justify-start gap-2 text-red-500 hover:text-red-600 whitespace-nowrap"
                                        >
                                            <LogOut size={18} /> Выйти
                                        </span>
                                    </DialogTrigger>
                                    <DialogContent className="w-[90%] sm:w-[450px]">
                                        <DialogHeader className="space-y-4">
                                            <DialogTitle className="text-center">Выход из аккаунта</DialogTitle>
                                            <DialogDescription className="text-center">
                                                Вы уверены, что хотите выйти из своего аккаунта?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="mt-4 flex gap-2 flex-row">
                                            <Button
                                                onClick={handleLogout}
                                                className="flex-1 bg-[#FF385C] text-white py-6 text-base font-semibold"
                                            >
                                                Выйти
                                            </Button>
                                            <Button
                                                onClick={() => setShowLogoutDialog(false)}
                                                className="flex-1 bg-transparent text-black border border-black py-6 text-base font-semibold"
                                            >
                                                Отмена
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:flex-1">
                        {renderActiveTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
