import React, { useState,useEffect,useRef, useMemo, createRef, useCallback } from "react";
import File from "../../components/forms/File/index"
import html2canvas from "html2canvas";
import { history } from "../../utils/index";

import 'react-image-crop/dist/ReactCrop.css';

import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';

import {generateDownload} from '../../views/register/Crop';

import Stepper from "../../components/stepper";
import LogoSticker from "../../assets/img/register/icon_sticker.png"
// import Modal from 'react-modal';
import { Button,Modal } from 'react-bootstrap'

import { Image as KonvaImage, Layer, Stage } from "react-konva";
import useImage from "use-image";

import { stickersData } from "./stiker/stickers.data";
import { IndividualSticker } from "./stiker/individualSticker";

const Index = ({dataq, action, back, dataTB}) => {
    const [idpromo, setIdpromo] = useState();
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [name, setName] = useState();
    const [wa, setWa] = useState();
    const [generated, setGenerated] = useState();
    const [dataFromRegister, setDataFromRegister] = useState();
    const datax = dataq? dataq : null
    const [heightImage, setHeightImage] = useState("")

    useEffect(() => {
        handleRefresh();
        setHeight(ImageRef.current.clientHeight);
        getListSize();
    }, [])

    useEffect(() => {
        window.addEventListener("resize", getListSize);
      }, []);

    const handleRefresh = () =>{
        if (datax){
            setImage(URL.createObjectURL(datax.gambar))
            setDataFromRegister(datax)
        }
    }

    const [image, setImage] = useState(null)

    const [croppedArea, setCroppedArea] = useState(null)
    const [crop, setCrop] = useState({ x : 0, y : 0});
    const [zoom, setZoom] = useState(1)

    const onCropComplete = (cropAreaPersentage, cropAreaPixel) => {
        setCroppedArea(cropAreaPixel)
    }

    const batal = () => {
        back(false)
    }

    const uploadCropImage = () => {
        const generatedd = generateDownload(image, croppedArea).then(val => { 
            setGenerated(val)
            let dataFromCrop = {
                idpromo: dataFromRegister?.idpromo,
                latitude: dataFromRegister?.latitude,
                longitude: dataFromRegister?.longitude,
                name: dataFromRegister?.name,
                no_whatsapp: dataFromRegister?.no_whatsapp,
                gambar : val,
                city: dataFromRegister?.city,
                nik: dataFromRegister?.nik
            }
            setStep(step+1)

            let newImage = imageCrop

            newImage.preview = dataFromCrop.gambar.toDataURL("image/png", 0.5)
            newImage.preview= newImage.preview? handleToFile(newImage?.preview) : ""
            newImage.preview = newImage.preview? URL.createObjectURL(newImage.preview) : ""

            setDataCrop(newImage);

            let data = {
                "idpromo" : idpromo,
                "latitude" : latitude,
                "longitude" : longitude,
                "name" : name,
                "wa" : wa
            }
            localStorage.setItem('userRegis', JSON.stringify(data));
        } )
    }

    const handleBack = () => {
        history.push({
            pathname: `/promo/${idpromo}`,
        })
    }

    const ImageRef = useRef();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [dataCrop, setDataCrop] = useState();
    const [imageCrop, setImageCrop] = useState({ preview: "", raw: "", filename: "" });

    const getListSize = () => {
        const newWidth = ImageRef?.current?.clientWidth;
        setWidth(newWidth);
    
        const newHeight = ImageRef?.current?.clientHeight;
        setHeight(newHeight);
      };

    const GambarTwibbon = () => {
        getListSize()
        return (
            <img style={{width:"100%", position:"absolute"}} src={image} ref={ImageRef}/>
        )
    }

    const cekSize = () => {
        if (parseInt(height) < parseInt(width)) {
            return height
        }
        return width * (81/100)
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    const handleToFile = (url) => {
        let dataBlob = dataURLtoBlob(url)

        dataBlob.name = "image.jpeg"
        dataBlob.lastModified = new Date().getTime()
        dataBlob.lastModifiedDate = new Date();
        const myFile = new File([dataBlob], "image.jpeg", {
            type: dataBlob.type,
        });
        return (myFile.props[0])
    }

    const [step, setStep] = useState(0);

    const steps = useMemo(() => {
        let list = ["Edit Bingkai", "Sticker"]
        return list;
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [images, setImages] = useState([]);
    const addStickerToPanel = ({ src, width, x, y }) => {
        setImages((currentImages) => [
          ...currentImages,
          {
            width,
            x,
            y,
            src,
            resetButtonRef: createRef()
          }
        ]);
    };
    
    const resetAllButtons = useCallback(() => {
        images.forEach((image) => {
            if (image.resetButtonRef.current) {
            image.resetButtonRef.current();
            }
        });
        }, [images]);

        const handleCanvasClick = useCallback(
        (event) => {
            if (event.target.attrs.id === "backgroundImage") {
            resetAllButtons();
            }
        },
        [resetAllButtons]
    );


    const [background] = useImage(imageCrop.preview);
    
    const [hideClose, setHideClose] = useState(false);
    const cekClose = () => {
        if (hideClose) {
            // uploadImage()
        } else {
            setHideClose(true)
            resetAllButtons()
            setTimeout(function () {
                uploadImage()
            }, 1000);
        }
    }

    const uploadImage = () => {
        var data = document.getElementById('addSticker')
        html2canvas(data).then((canvas)=>{
            var url_blob = []
            var image = canvas.toBlob(function(blob){
                var url = URL.createObjectURL(blob)


                let dataFromCrop = {
                    idpromo: dataFromRegister?.idpromo,
                    latitude: dataFromRegister?.latitude,
                    longitude: dataFromRegister?.longitude,
                    name: dataFromRegister?.name,
                    no_whatsapp: dataFromRegister?.no_whatsapp,
                    gambar : url,
                    city: dataFromRegister?.city,
                    nik: dataFromRegister?.nik
                }
                action(dataFromCrop);
            })
        })
    }

    const backStep = () => {
        setStep(step-1)
        setDataCrop("");
    }

    return(
        <div className="form-register style-frame-twibbon">
            <Stepper steps={steps} step={step} />
            {step === 0 && (
                <div>
                    <div id="photoCropTwibbon">
                        <div className="frame-twibbon">
                            <img className="img-preview" style={{width: height ? cekSize():'' , height:height ? cekSize():'', maxWidth:300}} src={process.env.REACT_APP_API_URL + dataTB.twibbon_url} />
                        </div>
                        <div className="image-crop" id="twibbon">
                            <div style={{position:"relative", overflow:"hidden"}}>
                                <GambarTwibbon></GambarTwibbon>
                                <div style={{width:"100%", height:height ? height : '300px', position:"absolute", backgroundColor:"white"}}></div>
                            </div>

                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>
                    </div>
                    <div className="slider-crop-image">
                        <Slider 
                            min={1} 
                            max={3} 
                            step={0.1} 
                            value={zoom} 
                            onChange={(e, zoom) => setZoom(zoom)} 
                        />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <button type="button" className="button-kembali"
                            onClick={()=> batal()}>
                                Kembali
                            </button>
                        </div>
                        <div className="col-6">
                            <button type="button" className="button-kirim"
                            onClick={()=> uploadCropImage()}>
                                Selanjutnya
                            </button>
                        </div>
                    </div>

                </div>
            )}
            {step === 1 && (
                <div>
                    <div className="frame-twibbon">
                        {/* <img className="img-preview" style={{width: '80%' , height:'300px', maxWidth:'80%', top:'48%'}} src={process.env.REACT_APP_API_URL + dataTB.twibbon_url} /> */}
                    </div>
                    <div className="hasil-image-crop" id="twibbon">
                        <div style={{position:"relative", overflow:"hidden"}}>
                            <GambarTwibbon></GambarTwibbon>
                            <div style={{width:"100%", height: '300px', position:"absolute", backgroundColor:"white"}}></div>
                        </div>

                        <div id="addSticker">
                            <Stage
                                width={300}
                                height={300}
                                onClick={handleCanvasClick}
                                onTap={handleCanvasClick}
                                className="stage-canvas-sticker"
                            >
                                <Layer>
                                    <KonvaImage
                                        image={background}
                                        height={400}
                                        width={600}
                                        id="backgroundImage"
                                        className="stage-canvas-sticker"
                                    />
                                    {images.map((image, i) => {
                                        return (
                                            <IndividualSticker
                                                onDelete={() => {
                                                const newImages = [...images];
                                                newImages.splice(i, 1);
                                                setImages(newImages);
                                                }}
                                                onDragEnd={(event) => {
                                                image.x = event.target.x();
                                                image.y = event.target.y();
                                                }}
                                                key={i}
                                                image={image}
                                                hide={hideClose}
                                            />
                                        );
                                    })}
                                </Layer>
                            </Stage>
                        </div>

                    </div>
                    <div className="">
                        <button type="button" className="button-stiker"
                            onClick={ handleShow}>
                                <span>
                                    <img src={LogoSticker} className="icon-sticker"></img>
                                    <span>Pilih Sticker</span>
                                </span>
                        </button>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <button type="button" className="button-kembali"
                            onClick={()=> backStep()}>
                                Kembali
                            </button>
                        </div>
                        <div className="col-6">
                            <button type="button" className="button-kirim"
                            onClick={()=> cekClose()}>
                                Upload
                            </button>
                        </div>
                    </div>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <   Modal.Title>Sticker</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            
                            <div>
                                <ul class="press">
                                    {stickersData.map((sticker) => {
                                        return (
                                            <li>
                                                <button
                                                    className="button"
                                                    onMouseDown={() => {
                                                    addStickerToPanel({
                                                        src: sticker.url,
                                                        width: sticker.width,
                                                        x: 100,
                                                        y: 100
                                                    });
                                                    }}
                                                >
                                                    <img alt={sticker.alt} src={sticker.url} width={sticker.width} />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            )}
        </div>
    );
}

export default Index