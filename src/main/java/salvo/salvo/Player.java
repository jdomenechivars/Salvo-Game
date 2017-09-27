package salvo.salvo;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String userName;

    @OneToMany(mappedBy ="player", fetch = FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    public Player() {}

    public Player(String mail){
        this.userName = mail;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    // El Get y el Set, como las variables son privadas, són métodos que te permiten
    // acceder a la variable o cambiar la variable desde otras classes.


}
