import React, { useEffect, useState } from 'react'
import { Typography, Button, Form, message, Input, Icon} from "antd"
import TextArea from 'antd/lib/input/TextArea';
import Dropzone from "react-dropzone";
import Axios from 'axios';
import { useSelector } from "react-redux";

const { Title } = Typography;

const PrivateOption = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]
const CategotyOption = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"}
]

function UploadPage(props) {

    const user = useSelector(state => state.user)

    const [VidoeTitle, setVidoeTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Private, setPrivate] = useState(0)
    const [Category, setCategory] = useState(0)
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (e) =>{
        setVidoeTitle(e.currentTarget.value)
    }

    const onDescriptionChange = (e) =>{
        setDescription(e.currentTarget.value)
    }

    const onPrivateChange =(e) =>{
        setPrivate(e.currentTarget.value)
    }

    const onCategoryChange=(e)=>{
        setCategory(e.currentTarget.value)
    }

    const onDrop=(files)=>{

        var formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file",files[0])

        console.log(files)

        Axios.post('/api/video/uploadfiles', formData,config)
            .then(response => {
                if(response.data.success){
                    console.log(response.data)
                    var variable = {
                        url:response.data.url,
                        fileName:response.data.fileName
                    }
                    setFilePath(response.data.url)

                    Axios.post('/api/video/thumbnail', variable)
                    .then(response => {
                        if(response.data.success){
                            setDuration(response.data.fileDuration)
                            setThumbnailPath(response.data.url)
                        }else{
                            alert("썸네일 생성에 실패 했습니다.")
                        }
                    })
                }else{
                    alert("비디오 업로드를 실패했습니다.")
                }
            })
    }

    const onSubmit=(e)=>{
        e.preventDefault();

        const variable = {
            writer: user.userData._id,
            title : VidoeTitle,
            description: Description,
            private : Private,
            filePath : FilePath,
            category : Category,
            duration : Duration,
            thumbnail: ThumbnailPath
        }

        Axios.post('/api/video/uploadVideo', variable)
        .then(response => {
            if(response.data.success){
                message.success("비디오 업로드에 성공하였습니다.")
                setTimeout(() => {
                    props.history.push('/')
                }, 3000);
            }else{
                alert("비디오 업로더에 실패했습니다.")
            }
        })
    }

    return (
        <div style={{ maxWidth:'700px', margin:"2rem auto"}}>
            <div style={{ textAlign:"center", marginBottom:"2rem"}}>
                <Title level={2}>Upload Video</Title>
            </div>

            <Form onSubmit={onSubmit}>
                <div style={{ display:"flex", justifyContent:'space-between'}}>
                    {/* { Drop zone} */}
                    <Dropzone
                    accept="video/*"
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={100000000000000}>
                    {({ getRootProps, getInputProps})=> (
                        <div style={{cursor:"pointer" ,width:"300px", height:"240px", border:'1px solid lightgray',display:"flex",
                        alignItems:"center", justifyContent:"center"}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize:'3rem'}} />
                        </div>
                    )}
                    </Dropzone>
                    {/* Thumbnail */}
                    {ThumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail"/>
                    </div>  
                    }
                    
                </div>

                <br />
                <br />
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={VidoeTitle}
                />
                <br />
                <br />
                <label>Description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={Description}
                />
                <br />
                <br />

                <select onChange={onPrivateChange}>
                    {PrivateOption.map((item, i)=>(
                        <option key={i} value={item.value} >{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <select onChange={onCategoryChange}>
                    {CategotyOption.map((item,i)=>(
                    <option key={i} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <br />
                <br />

                <Button type="primary" size="large" onClick={onSubmit}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default UploadPage
