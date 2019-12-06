import React from 'react';
import PageOne from '../../pages/PageOne'
import ChildOne from '../../pages/PageOne/ChildOne'
import ChildTwo from '../../pages/PageOne/ChildTwo'
import PageTwo from '../../pages/PageTwo'
import PageThree from '../../pages/PageThree'

export default {
    'page1': {
        name: '页面1',
        component: () => <PageOne />
    },
    'children1': {
        name: '内页1',
        component: () => <ChildOne />
    },
    'children2': {
        name: '内页2',
        component: () => <ChildTwo />
    },
    'page2': {
        name: '页面2',
        component: () => <PageTwo />
    },
    'page3': {
        name: '页面3',
        component: () => <PageThree />
    },

}
