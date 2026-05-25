import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socket = io ('https://squarewebsocketbackend.onrender.com', {
  transports: ['websocket']
})



export default function App() {

  const [nome, setNome] = useState('');
  const [entrou, setEntrou] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
      socket.on('player', (id) => {
        setId(id);
      });

      socket.on('update', (users) => {
        setUsuarios(users);
      });

      return () => {
        socket.off('player');
        socket.off('update');
      }

  }, []);

  function entrouGameRoom(){
    if (!nome){
      return;
    }

    socket.emit("join", nome);
    setEntrou(true);
  }

  function movimentar(dx, dy){
    const usuario = usuarios.find(user => user.id == id);

    if (!usuario) {
      console.log("Usuário não encontrado!");
      return;
    }
    
    socket.emit("move", {
      x: usuario.x + dx,
      y: usuario.y +dy
    })
  }
    

    if (entrou == false) {
      return (
          <View>
            <Text>Digite seu nome:</Text>
            <TextInput
              value={nome}
              onChangeText={(novoTexto) => setNome(novoTexto)}
            >
            </TextInput>
            <TouchableOpacity onPress={() => entrouGameRoom()}>
              <Text>Entrar</Text>
            </TouchableOpacity>
          </View>
        );
    }
    else{
      return(
        <View style={styles.areaGlobal}>
          <View style={styles.areaJogo}>
            {
              usuarios.map(usuario => (
                <View
                style={[
                  styles.player,
                  {
                    left: usuario.x,
                    top: usuario.y,
                    backgroundColor: 
                      usuario.id == id ? "green" : "blue"
                  }
                ]}
                >
                  <Text>{usuario.name}</Text>
                </View>
              ))
            }
          </View>
          <View style={styles.controles}>
            <TouchableOpacity onPress={() => movimentar(0, -20)}>
              <Text>Cima</Text>
            </TouchableOpacity>
          
          <View style={styles.esquerdaDireita}>
            <TouchableOpacity onPress={() => movimentar(-20, 0)}>
              <Text>Esquerda</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => movimentar(20, 0)}>
              <Text>Direita</Text>
            </TouchableOpacity>            
          </View>
            <TouchableOpacity onPress={() => movimentar(0, 20)}>
              <Text>Baixo</Text>
            </TouchableOpacity>
          

          </View>
      </View>
      );
    }
  
}

const styles = StyleSheet.create({
  centralizar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    width: 200,
    margin: 10,
    padding: 5
  },
  areaGlobal: {
    flex: 1
  },
  areaJogo: {
    flex: 1,
    backgroundColor: "#EEEEEE"
  },
  player: {
    position: "absolute",
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  controles: {
    alignItems: "center",
    padding: 20
  },
  esquerdaDireita: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between"
  }
});
