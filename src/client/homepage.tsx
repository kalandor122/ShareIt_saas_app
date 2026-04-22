import React, { useState } from 'react';
import { Button } from './components/ui/button';
import type { User } from "wasp/entities";
import { useAction, deductUserCredits } from 'wasp/client/operations';

const homepage = ({ user }: { user: User }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const performDeduction = useAction(deductUserCredits);

    const handleButtonClick = async () => {
        const divisor = 1000; 
        const amountToSubtract = sliderValue / divisor;
        try {
            await performDeduction(amountToSubtract);
            alert(`Success! Subtracted ${amountToSubtract} credits.`);
            } catch (error: any) {
                alert('Error: ' + error.message);
            }
        };



    return (
        <div className='py-10 px-4 flex flex-col items-center gap-6'>
            <h1 className='text-4xl font-bold text-gray-900 dark:text-white'>
                Netezz!
            </h1>

        <p className='text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-center'>
            {user.credits}GB-od maradt!
        </p>

        
        <Button variant='outline' onClick={() => window.location.href = "/pricing"}>
            Vegyünk többet
        </Button>
        <Button  onClick={() => handleButtonClick()}>
            Csatlakozás!
        </Button>
        

        <div className='w-full max-w-md space-y-4'>
            <div className=''>
                <span className='font-mono bg-primary/10 px-2 rounded'>{sliderValue}</span>
                <label className='font-medium'>Mb</label>
                
            </div>
                <input
                type='range'
                min='0'
                max='100'
                value={sliderValue}
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary'
                />
            </div>
        </div>
    );
};
export default homepage;