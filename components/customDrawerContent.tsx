import { View, Text } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useRouter } from 'expo-router'

const CustomDrawerContent = (props:any) => {
    const router =useRouter()
  return (
    <DrawerContentScrollView {...props}>
        <DrawerItemList  {...props}/>
        <DrawerItem label={'logout'}   onPress={()=>{router.replace('/')}}    />
    </DrawerContentScrollView>
    
    
  )
}

export default CustomDrawerContent