import React, {useState, useEffect, useRef} from 'react'
import {InputGroup, InputGroupAddon, InputGroupButtonDropdown, Input, InputGroupText, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, Container} from 'reactstrap'
import api from '../../hooks/api'
import './CreateTrack.css'


const CreateTrack = props => {
  const [genres, setGenres] = useState([])
  const [dropdown, setDropdown] = useState(false)

  const trackName = useRef()
  const [remixable, setRemixable] = useState(false)
  const [genreSelection, selectGenre] = useState("Genre")
  const [genreId, setGenreId] = useState(0)
  const bpm = useRef()
  
  const getGenres = () => {
    api.getAll('genres')
      .then(genreList => {
        const genreArr = []
        for(const genre in genreList){
          const genreData = {key: genreList[genre].id, value: genreList[genre].genre_name}
          genreArr.push(genreData)
        }
        setGenres(genreArr)
      })
    
  }
  const toggleDrop = () => {
    setDropdown(!dropdown)
  }
  const genreDropdown = (genre) => {
    selectGenre(genre.value)
    setGenreId(genre.key)
  }
  const submit = () => {
    const newTrackData = {
      "track_name": trackName.current.value,
      "genre_name": genreId,
      "open_for_remix": remixable,
      "bpm": bpm.current.value
    }
    api.post("tracks", newTrackData)
      .then(props.history.push('/home'))
  }

  useEffect(() => {
    getGenres()
  },[])
  
  return (
    <>
      <Container className="temp">
        <div className="create-track-input">
          <InputGroup className="track-name-input">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>Track Name</InputGroupText>
            </InputGroupAddon>
            <Input placeholder="Track Name" innerRef={trackName}/>
          </InputGroup>

          <br />
        
          <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>Select Genre</InputGroupText>
          </InputGroupAddon>
            <Dropdown isOpen={dropdown} toggle={toggleDrop}>
              <DropdownToggle caret>
                {genreSelection}
              </DropdownToggle>
              <DropdownMenu>
                {genres.map(
                  genre => <DropdownItem  
                  key={genre.key} 
                  onClick={() => genreDropdown(genre)}>
                    {genre.value}
                      </DropdownItem>)}
              </DropdownMenu>
            </Dropdown>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                Available to remix?
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <InputGroupText>
                <Input addon type="checkbox" onChange={() => setRemixable(!remixable)}/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <br/>
          <InputGroup>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                Track Tempo
              </InputGroupText>
            </InputGroupAddon>
            <Input type="number" innerRef={bpm}/>
          </InputGroup>
        <Button onClick={submit} className="submit-btn">Submit</Button>
        </div>
      </Container>
    </>
  )
}


export default CreateTrack