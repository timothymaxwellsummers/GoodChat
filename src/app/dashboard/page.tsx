import React from 'react';
import Chat from './components/chat';
import Options from './components/options';

const DashboardPage: React.FC = () => {
    return (
        <div>
            <Chat>
                <Options/>
            </Chat>
        </div>
    );
};

export default DashboardPage;