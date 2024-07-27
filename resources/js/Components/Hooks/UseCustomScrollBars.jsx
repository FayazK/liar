import {theme} from 'antd';
import {useEffect} from 'react';

const useCustomScrollbars = () => {
    const {token} = theme.useToken();

    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
      *::-webkit-scrollbar {
        height: 5px;
        width: 5px;
      }
      *::-webkit-scrollbar-thumb {
        background-color: ${token.colorBorder}; // Use Ant Design's primary color
        border-radius: 20px;
      }
      *::-webkit-scrollbar-track {
        background-color: ${token.colorFillQuaternary}; // Use Ant Design's component background color
        border-radius: 4px;
      }
      *::-webkit-scrollbar-thumb:hover {
        background-color: ${token.colorFill}; // Use a slightly different color on hover
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:active {
        background-color: ${token.colorPrimaryActive}; // Use a different color when active
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, [token]);
};

export default useCustomScrollbars;
