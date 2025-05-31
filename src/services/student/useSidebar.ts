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
      path: '/student',
    },
    {
      title: 'Fees',
      icon: image2,
      path: '/student/feesss',
      hasChildren: true,
      children: [
        {
          title: 'School Fee',
          path: '/student/fees',
        },
        {
          title: 'Stand Alone',
          path: '/student/stand-alone-fee',
        },
      ],
    },
    {
      title: 'Bio Data',
      icon: image3,
      path: '/student/bio-data',
    },
    {
      title: 'Academics',
      icon: image4,
      path: '/student/academics',
      hasChildren: true,
      children: [
        {
          title: 'Course Registration',
          path: '/student/course-registration',
        },
        {
          title: 'My Results',
          path: '/student/my-results',
        },
      ],
    },
    {
      title: 'My Accomodation',
      icon: image6,
      path: '/student/my-accomodation',
    },
    {
      title: 'Change Programme',
      icon: image7,
      path: '/student/change-programme',
    },
    {
      title: 'My Document',
      icon: image8,
      path: 'my-documents',
    },
    {
      title: 'Self Service',
      icon: image9,
      path: '/student/self-service',
    },
    {
      title: 'Settings',
      icon: image10,
      path: '/student/student-settings',
    },
  ])

  return { items }
})
