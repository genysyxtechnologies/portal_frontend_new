import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import image2 from '../../assets/images/student/sidebar/image2.png'
import image3 from '../../assets/images/student/sidebar/image3.png'
import image4 from '../../assets/images/student/sidebar/image4.png'
import image6 from '../../assets/images/student/sidebar/image6.png'
import image7 from '../../assets/images/student/sidebar/image7.png'
import image8 from '../../assets/images/student/sidebar/image8.png'
import image9 from '../../assets/images/student/sidebar/image9.png'
import image10 from '../../assets/images/student/sidebar/image10.png'

export const useStudentSideBar = createSharedComposable(() => {
  const items = ref([
    {
      title: 'Dashboard',
      icon: image4,
      path: '/dashboard',
    },
    {
      title: 'Fees',
      icon: image2,
      path: '/dashboard/feesss',
      hasChildren: true,
      children: [
        {
          title: 'School Fee',
          path: '/dashboard/fees',
        },
        {
          title: 'Standalone',
          path: '/dashboard/stand-alone-fee',
        },
      ],
    },
    {
      title: 'Bio Data',
      icon: image3,
      path: '/dashboard/bio-data',
    },
    {
      title: 'Academics',
      icon: image4,
      path: '/dashboard/academics',
      hasChildren: true,
      children: [
        {
          title: 'Registration',
          path: '/dashboard/course-registration',
        },
        {
          title: 'Results',
          path: '/dashboard/my-results',
        },
        {
          title: 'Choice of programme',
          path: '/dashboard/change-programme',
        },
      ],
    },
    {
      title: 'My Accommodation',
      icon: image6,
      path: '/dashboard/my-accomodation',
    },
    // {
    //   title: 'My Document',
    //   icon: image8,
    //   path: 'my-documents',
    // },
    {
      title: 'Self Service',
      icon: image9,
      path: '/dashboard/self-service',
    },
    {
      title: 'Account',
      icon: image10,
      path: '/dashboard/student-settings',
    },
  ])

  return { items }
})
