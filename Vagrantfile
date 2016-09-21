Vagrant.configure("2") do |config|
    config.vm.box = "ubuntu/precise64"
    config.vm.box_url = "https://vagrantcloud.com/ubuntu/precise64"
    config.vm.network :forwarded_port, guest: 3000, host: 3000

    config.vm.provider :virtualbox do |v|
        v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
        v.customize ["modifyvm", :id, "--memory", 1024]
        v.customize ["modifyvm", :id, "--name", "land-registry-elements"]
    end

    config.vm.provision :shell, :path => "vagrant/bootstrap.sh", :privileged => false

    config.vm.synced_folder ".", "/vagrant", type: "rsync",
        rsync__exclude: [".git/", "node_modules/"]

    config.vm.synced_folder "./test/fixtures/visual-regression", "/vagrant/test/fixtures/visual-regression", :create => true
end
