import 'react-native-gesture-handler';
import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Image, SafeAreaView, StatusBar, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Card } from 'react-native-elements';
import _ from 'lodash';
import {getData} from './api';
import {callSearchKeyword} from '../../API/api';
import _Color from '../../styles/_Colors';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../redux/actions'

 const HomeContainer = ({navigation}) => {
    const dispatch = useDispatch();
    const keywords = useSelector((state)=>state.keywords)
    //const keywords = "ddd"
    //const keywords = useSelector((state)=>state.)
    // const {keywords} = useSelector((state)=>{
    //     console.log(state);
    //     // return{
    //     //     keywords: state.searchStore.keywords
    //     // }
    // })

    const [keywordData, setKeywordData] = useState('')
    const [query, setQuery] = useState('');
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [state, setState] = useState({
        keyword: '',
        data: [],
        paging: {
            page: 1,
            per_page: 20,
            total: 1
        },
    })

    const { keyword, data, paging } = state;
    const updateSearch = (keyword) => {
      setState({ keyword });
    };
    const search = param => {
        if(!param.keyword){
            return;
        }

    }
    
    const onChagneKeyword = (keyword) => {
        // const searchData = await callSearchKeyword(paging.page, paging.per_page, keyword)
        // .then(response=>{
        //     console.log('[response]',response)
        //     return response.data.data;
        // })
        // setList(searchData);

        console.log("onChagneKeyword")

        const payload = {
            page : paging.page,
            per_page : paging.per_page,
            keyword : keyword,
        }

        dispatch(actions.getSearchKeyword(payload));
        
        // if(cancelPrevQuery) return;
    }


    const sendQuery = async () => {
        const searchData = await callSearchKeyword(paging.page, paging.per_page, keyword)
        .then(response=>{
            console.log('[response]',response)
            return response.data.data;
        })
        setList(searchData);
        if(cancelPrevQuery) return;
    }
    
    // const getItemLayout = useCallback(
    //     (data, index) => ({
    //         length: ITEM_HEIGHT,
    //         offset: ITEM_HEIGHT * index,
    //         index,    
    //     }), 
    //     []
    // );    
    
    useEffect(async () => {
        const list = await getData(page).then(response=>{
            return response.data.data;
        })
        setList((prev) => [...prev, ...list]);
        console.log('list', list)
    }, [page]);

    useEffect(()=>{
     console.log("keywords----------", keywords)
    },[keywords])


    const renderItem = useCallback(({ item, index, separators }) => (
        <TouchableOpacity 
            style={styles.listContaienr} 
            onPress={() => navigation.navigate('DetailPage', {
                page_id: item.ID,
                title: item.title,
                brandName: item.brandName,
                subTitle: item.subTitle,
                content: item.content,
                imageUrl: item.imageUrl,
            })}
            navigation={navigation}
            >
            <Card 
                key={item.ID}
                containerStyle={styles.cardItemOuter} 
                wrapperStyle={styles.cardItemInner}>
                <Image
                    style={styles.image}
                    resizeMode="cover"
                    source={{ uri: item.imageUrl }}
                />
                <View style={styles.areaText}>
                    <Text style={styles.majorType}>{item.majorCategoryName}</Text>
                    <Text numberOfLines={1} style={styles.cardTitle}>{item.title}</Text>
                    <Text numberOfLines={1} style={styles.cardDesc}>{item.content}</Text>
                </View>
            </Card>
        </TouchableOpacity>    
    ))
    return (
    <>
        <StatusBar/>
          <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
          <View style={{ flex: 1, alignItems: 'center'}}>
            <SearchBar
                placeholder="파트너를 검색해보세요."
                onChangeText={(val) => { setKeywordData(val) }}
                onSubmitEditing={()=> {onChagneKeyword(keywordData)}}
                value={keywordData} 
                platform={Platform.OS}
                clearIcon={true}
                onClearText={() => console.log('onClearText')}
                cancelButtonTitle='Cancel'
                />
                {list &&
                <FlatList
                    numColumns={2}  
                    columnWrapperStyle={styles.row}
                    data={list}
                    keyExtractor={(item) => item.ID}
                    renderItem={renderItem}
                    // getItemLayout={getItemLayout}
                    onEndReachedThreshold={0.8}
                    initialNumToRender={20}
                    removeClippedSubviews={true}
                />}
            </View>
        </SafeAreaView>
        </>
    )
}
 
const styles = StyleSheet.create({
    listContaienr: {
        width: '48%',
        height: 280,
        padding: 0,
        margin: '1%',
        alignSelf: "flex-start",
    },
    cardContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        backgroundColor: 'orange',
        justifyContent: 'space-around',
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
        alignSelf: 'center',
        textAlign: 'left',
    },
    //card
    cardItemOuter:{
        width: '100%',
        height: 280,
        margin: '2%',
        padding: 0,
        marginTop: '4%',
        alignSelf: "center",
        borderWidth: 0,
        elevation:0,
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 0, //default is 1
        shadowRadius: 0//default is 1
    },
    cardItemInner:{
        padding: 0,
        borderWidth: 0,
        elevation:0,
    },
    image:{
        width: '100%',
        height: 210,
        padding: 0,
        borderRadius:6,
    },
    majorType: {
        paddingBottom: 2,
        color: _Color.mainColor,
        fontWeight: 'bold'
    },
    areaText: {
        padding: '4%'
    },
    cardTitle:{
        fontSize: 16,
        fontWeight: 'bold'
    },
    cardDesc: {
        fontSize: 14,
        marginTop: 5,
    }
})
 export default HomeContainer;
 