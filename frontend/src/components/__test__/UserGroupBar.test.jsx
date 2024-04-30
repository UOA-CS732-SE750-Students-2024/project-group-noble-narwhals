import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // 导入 jest-dom 扩展包
import { fireEvent } from '@testing-library/react'; // 导入 fireEvent
import MockAdapter from 'axios-mock-adapter'; // 导入 axios-mock-adapter
import axios from 'axios'; // 导入 axios
import { MemoryRouter } from 'react-router-dom';
import UserGroupBar from '../UserGroupBar'; // 导入你的UserGroupBar组件
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime); // 确保日期处理功能被正确加载

let axiosMock;

const group1 =
{
    "_id": "000000000000000000000001",
    "groupName": "test",
    "createDate": {
        "$date": "2024-04-27T10:04:10.278Z"
    },
    "deadlineDate": {
        "$date": "2024-05-10T00:00:00.000Z"
    },
    "groupMembers": [
        {
            "_id": "000000000000000000000001"
        },
        {
            "_id": "000000000000000000000002"
        },
    ],
    "groupDescription": "hahaha",
    "groupTags": [
        {
            "_id": "000000000000000000000001"
        }
    ],
    "ownerId": {
        "_id": "000000000000000000000001"
    },
    "groupStatus": "available",
    "groupType": "group",
    "maxNumber": 6,
    "likeNumber": 1,
    "__v": 11
}

const tag1 = {
    "_id": "000000000000000000000001",
    "name": "tag1"
}

// beforeEach(() => {
//     axiosMock = new MockAdapter(axios);
//     axiosMock.onGet(`http://localhost:3000/api/user/userData/${group1._id}`).reply(200, group1);

// });

// //after each test, reset the mock
// afterEach(() => {
//     fireEvent.scroll(window, { target: { scrollY: 0 } });
//     axiosMock.reset();
// });




describe('UserPageSideBar Component', () => {
    test('UserGroupBar renders correctly with provided group data', () => {
        render(<MemoryRouter>  
            <UserGroupBar group={group1} />
        </MemoryRouter>); // 渲染组件并传入测试数据

        // 检查组件是否正确渲染了所有必要信息
        expect(screen.getByText('test')).toBeInTheDocument(); // 确认组名
        expect(screen.getByText(/hahaha/i)).toBeInTheDocument(); // 使用正则表达式忽略大小写

        const statusElement = screen.getByText('available');
        expect(statusElement).toBeInTheDocument();
    });


});
