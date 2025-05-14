import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Home, Edit, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const ProfileComponent = () => {
  const [profileData, setProfileData] = useState({
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
  });

  const [editData, setEditData] = useState(profileData);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: 'Home',
      address: '123 Main St, Apt 4B, New York, NY 10001',
      isDefault: true,
    },
    {
      id: 2,
      title: 'Work',
      address: '456 Business Ave, Floor 5, New York, NY 10002',
      isDefault: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    title: '',
    country: '',
    address: '',
    province: '',
    city: '',
    district: '',
    zip: '',
  });

  const handleSaveProfile = () => {
    setProfileData(editData);
  };

  const handleAddAddress = () => {
    if (!newAddress.title || !newAddress.address) return;
    const newAddr = {
      id: Date.now(),
      title: newAddress.title,
      address: `${newAddress.country}, ${newAddress.province}, ${newAddress.city}, ${newAddress.district}, ${newAddress.address}, ${newAddress.zip}`,
      isDefault: false,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setNewAddress({
      title: '',
      country: '',
      address: '',
      province: '',
      city: '',
      district: '',
      zip: '',
    });
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className='flex flex-col lg:flex-row gap-4'>
      {/* Profile Block */}
      <div className='bg-white w-full lg:w-1/2 p-6 rounded-lg shadow-sm'>
        <div className='flex justify-between items-center pb-4 border-b'>
          <h2 className='text-xl font-semibold'>Детали профиля</h2>
          <Dialog>
            <DialogTrigger>
              <span className='flex items-center cursor-pointer rounded-md p-2 gap-1 bg-[#FF385C] text-white'>
                <Edit size={16} /> Редактировать
              </span>
            </DialogTrigger>
            <DialogContent className='min-w-[300px] sm:min-w-[600px]'>
              <DialogHeader>
                <DialogTitle>Редактировать профиль</DialogTitle>
                <DialogDescription>
                  Внесите изменения и нажмите сохранить.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='flex flex-col sm:flex-row justify-between gap-4'>
                  <div className='w-full'>
                    <Label htmlFor='name'>Имя</Label>
                    <Input
                      id='name'
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className='w-full'>
                    <Label htmlFor='surname'>Фамилия</Label>
                    <Input
                      id='surname'
                      value={editData.surname}
                      onChange={(e) =>
                        setEditData({ ...editData, surname: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor='phone'>Телефон</Label>
                  <Input
                    id='phone'
                    type='tel'
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    onClick={handleSaveProfile}
                    className='bg-[#FF385C] text-white w-full'
                  >
                    Сохранить
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className='flex flex-col gap-2 pt-3'>
          <div className='flex justify-between text-sm sm:text-base text-[#A0A8B0] font-medium'>
            <p className='flex-1 text-center'>Имя</p>
            <p className='flex-1 text-center'>Email</p>
            <p className='flex-1 text-center'>Телефон</p>
          </div>
          <div className='flex justify-between text-sm sm:text-base text-[#1B1B1B] font-medium'>
            <p className='flex-1 text-center'>{profileData.name}</p>
            <p className='flex-1 text-center'>{profileData.email}</p>
            <p className='flex-1 text-center'>{profileData.phone}</p>
          </div>
        </div>
      </div>

      {/* Address Block */}
      <div className='bg-white flex-2 p-6 rounded-lg shadow-sm w-full'>
        <div className='flex justify-between items-center mb-4 flex-col md:flex-row gap-4 md:gap-0'>
          <h2 className='text-xl font-semibold'>Детали адреса</h2>
          <Dialog>
            <DialogTrigger>
              <span className='flex cursor-pointer p-2 rounded-md items-center gap-1 bg-[#FF385C] text-white'>
                <Plus size={16} /> Добавить адрес
              </span>
            </DialogTrigger>
            <DialogContent className='min-w-[90vw] md:min-w-[600px]'>
              <DialogHeader>
                <DialogTitle>Добавить адрес</DialogTitle>
              </DialogHeader>
              <div className='space-y-3'>
                {[
                  ['title', 'Адресная этикетка'],
                  ['country', 'Страна'],
                  ['address', 'Адрес'],
                  ['province', 'Провинция'],
                  ['city', 'Город'],
                  ['district', 'Округ'],
                  ['zip', 'Почтовый индекс'],
                ].map(([key, label]) => (
                  <div key={key}>
                    <Label className='font-semibold'>{label}</Label>
                    <Input
                      value={(newAddress as any)[key]}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, [key]: e.target.value })
                      }
                    />
                  </div>
                ))}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      onClick={handleAddAddress}
                      className='bg-[#FF385C] w-full'
                    >
                      Сохранить
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {addresses.length === 0 ? (
          <p className='text-gray-500'>У вас нет сохраненных адресов</p>
        ) : (
          <div className='space-y-4'>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className='border rounded-lg p-4 flex flex-col md:flex-row justify-between gap-4'
              >
                <div>
                  <div className='flex items-center gap-2'>
                    <Home size={16} className='text-gray-500' />
                    <h3 className='font-medium'>{addr.title}</h3>
                    {addr.isDefault && (
                      <span className='bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded'>
                        По умолчанию
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 mt-1'>{addr.address}</p>
                </div>
                <div className='flex gap-2 items-center'>
                  <Button variant='outline' size='sm'>
                    <Edit size={16} />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant='outline' size='sm' className='text-red-500'>
                        <Trash2 size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Удалить адрес</DialogTitle>
                        <DialogDescription>
                          Вы уверены, что хотите удалить адрес?
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className='flex flex-row gap-2'>
                        <DialogClose asChild>
                          <Button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className='bg-[#F04438] text-white flex-1'
                          >
                            Удалить
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant='outline' className='flex-1'>
                            Отмена
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
