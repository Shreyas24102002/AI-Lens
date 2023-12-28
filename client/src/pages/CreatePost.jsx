import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom';

import {preview} from '../assets';
import {getRandomPrompt} from '../utils';
import {FormField, Loader} from '../components';




const CreatePost = () => {
  const navigate = useNavigate();
  // Above line will allow to get back to the home page once the post is created.
   

  const[form, setForm]=useState({
    name: '',
    prompt: '',
    photo: '',
  });


  const [generatingImg,setGeneratingImg] = useState(false);
  const[loading,setLoading]= useState(false);


  const handleSubmit = async(e)=>{
      e.preventDefault();

      if(form.prompt && form.photo){
        setLoading(true);
        try {
          const response = await fetch('https://ai-lens-backend.onrender.com/api/v1/post',
          {
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
          
          }
          )

          await response.json();
          navigate('/');
          
        } catch (error) {
            alert(error);
        }finally{
          setLoading(false);
        }

      }else{
        alert("Please enter a prompt and generate a image")
      }
  }

  const handleChange = (e)=>{
    // To actually type values in our form field, we use this function
    // HandelChange dunction is simply going to take the event (key-press event)
    // and its going to call the setForm state.
    // There I  have spread the entre form and will update e.target.name with the newly created e.target.value (Means the character I typed in..)

    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSurpriseMe = ()=>{
    // Here we have to get the random prompt
    // I have already created getRandomPrompt function which accepts the form.prompt to ensure we dont render the same one.
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form, prompt: randomPrompt})
  }

  const generateImage = async () =>{
    if(form.prompt){
      try {
        setGeneratingImg(true);
        const response = await fetch('https://ai-lens-backend.onrender.com/api/v1/ai',
        {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
             prompt: form.prompt, 
          }),
      });
      const data= await response.json();

      setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`});
      } catch (error) {
        alert(error)
        console.log(error.message)
      }finally{
        setGeneratingImg(false)
      }
    }else{
      alert('Please enter a prompt')
    }
  }


  return (
    <section className="max-w-7x1 mx-auto px-10">
         <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>
          Create
        </h1>
        <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>
          Create imaginative and visually stunning images and share them with the community using AI-Lens. 
        </p>
      </div>


{/* FORM : -  */}
      <form className='mt-16 max-w-3x1 ' onSubmit={handleSubmit}>
          
          <div className='flex flex-col gap-5'>
            <FormField
              labelName="Your name"
              type="text"
              name="name"
              placeholder="ex: Shreyyy"
              value={form.name}
              handleChange={handleChange}
            />

            <FormField
              labelName="Prompt  "
              type="text"
              name="prompt"
              placeholder="ex: A plush toy robot sitting against a yellow wall"
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe = {handleSurpriseMe}
              
            />
            <div className='relative bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3
              flex justify-center item-center'>
              {form.photo ? (
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className="w-full h-full object-contain"

                /> 
              ):
              (
              <img 
              src={preview}
              alt="preview"
              className='w-9/12 h-9/12 object-contain opacity-40'
              
              />
              )}


              {generatingImg && (
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                  <Loader/>
                </div>
              )}
            </div>
           

            
          </div>

          <div className='mt-5 flex gap-5 '>
            <button
              type='button'
              onClick={generateImage}
              className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"

            >
              {generatingImg ? 'Generating...' : 'Generate'}
            </button>

          </div>

          <div className='mt-10 '>
                <p className='mt-2 text-[#666e75] text-[14px] ' >
                  Once you have created the image you want, you can share it 
                  with others in the community 
                </p>
                <button
                  type="submit"
                  className='mt-3 text-white bg-[Dodgerblue] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
                >
                  {loading ? 'Sharing...' : 'Share it with the community'}
                </button>
          </div>
      </form>
    </section>
  )
}

export default CreatePost;