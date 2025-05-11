import { createSharedComposable } from '@vueuse/core'
import { ref } from 'vue'
import image1 from '../../assets/images/student/sidebar/image1.png'
import image2 from '../../assets/images/student/sidebar/image2.png'
import image3 from '../../assets/images/student/sidebar/image3.png'
import image4 from '../../assets/images/student/sidebar/image4.png'
import image5 from '../../assets/images/student/sidebar/image5.png'
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
      path: '/student/fee',
    },
    {
      title: 'Bio Data',
      icon: image3,
      path: '',
    },
    {
      title: 'Course Registration',
      icon: image4,
      path: '',
    },
    {
      title: 'My Results',
      icon: image5,
      path: '',
    },
    {
      title: 'My Accomodation',
      icon: image6,
      path: '',
    },
    {
      title: 'Dashboard',
      icon: image7,
      path: '',
    },
    {
      title: 'Change Programme',
      icon: image8,
      path: '',
    },
    {
      title: 'My Document',
      icon: image9,
      path: '',
    },
    {
      title: 'Self Service',
      icon: image10,
      path: '',
    },
  ])

  return { items }
})
